const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Flash tier - fast and inexpensive, well suited to a short chat/advice assistant.
// (gemini-3.7-flash returned 503 UNAVAILABLE under load during testing; 3.6 was stable.)
const MODEL = "gemini-3.6-flash";

const SYSTEM_PROMPT_BASE = `You are the in-app assistant for BudgetMate, a personal budget tracker built for students and young professionals in Ghana. You have two jobs:

1. Help desk: help users understand how to use the app. Key features:
   - Dashboard: this month's income, expenses, net balance, budget status, and recent transactions.
   - Transactions: add/edit/delete income or expense entries (amount, category, date, payment method, description); filter and search past entries.
   - Pay: make a real payment via Paystack (card or Mobile Money) for an expense category. Before paying, it shows whether the payment will push that category's spending to 80% or over 100% of its budget, and warns before you confirm.
   - Budgets: set a monthly GH₵ limit per expense category; progress bars show how much of each has been used.
   - Reports: pie chart of spending by category, 6-month income vs expenditure bar chart, category spending trend line chart, and a monthly summary with top spending categories.
   - Settings: update profile (name, email, currency) and manage custom categories.
   - Alerts: the system automatically warns at 80% of a budget and again when it's exceeded (100%+), both as banners and in the notification bell.

2. Financial advisor: give practical, specific spending guidance based on the user's actual income and expenses (provided below), tailored to the Ghanaian context — mobile money fees, transport (trotro/Uber), data/airtime, hostel/accommodation costs, etc. You may reference simple heuristics like needs/wants/savings splits, but adapt the numbers to the user's real figures rather than reciting a rule blindly. Be concrete: name categories and GH₵ amounts, don't just give generic advice.

Keep replies concise and conversational — a few short paragraphs or a short bullet list, never an essay. If there isn't enough data to give financial advice (e.g. no income recorded this month), say so plainly and suggest they add their income first.`;

function buildFinancialContextBlock(context) {
  if (!context || (context.totalIncome === 0 && context.totalExpense === 0)) {
    return "The user has not recorded any income or expenses this month yet.";
  }

  const budgetLines = context.budgets.length
    ? context.budgets
        .map(
          (b) =>
            `- ${b.categoryName}: GH₵${b.spent.toFixed(2)} spent of GH₵${b.amountLimit.toFixed(2)} budget (${b.percentUsed}% used)`
        )
        .join("\n")
    : "- No category budgets set yet.";

  return `Current month (${context.monthLabel}) financial snapshot for this user, in Ghana Cedi (GH₵):
- Total income: GH₵${context.totalIncome.toFixed(2)}
- Total expenses: GH₵${context.totalExpense.toFixed(2)}
- Net balance: GH₵${context.net.toFixed(2)}

Budgets:
${budgetLines}`;
}

/**
 * Uses the Gemini Interactions API: Google keeps the conversation thread server-side,
 * keyed by the returned interaction id, so we only ever send the newest message plus
 * a fresh system instruction (financial context can change between turns).
 */
async function chat({ message, previousInteractionId, financialContext }) {
  const systemInstruction = `${SYSTEM_PROMPT_BASE}\n\n${buildFinancialContextBlock(financialContext)}`;

  const interaction = await ai.interactions.create({
    model: MODEL,
    input: message,
    system_instruction: systemInstruction,
    ...(previousInteractionId ? { previous_interaction_id: previousInteractionId } : {}),
  });

  return { reply: interaction.output_text, interactionId: interaction.id };
}

module.exports = { chat };
