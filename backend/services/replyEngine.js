function buildReply(intent, data = {}) {
  const count = data.count || 0;

  /* =========================
     LOW STOCK
  ========================= */
  if (intent === "LOW_STOCK") {
    if (!count) {
      return "Everything is currently well stocked, and there are no immediate low inventory concerns at the moment.";
    }

    const items = data.items || [];
    const names = items.map(i => i.name).join(", ");

    return `There are ${count} products running low in inventory, including ${names}, and these items require timely restocking to prevent potential shortages and ensure smooth operations across the supply chain.`;
  }

  /* =========================
     DELAYED SHIPMENTS
  ========================= */
  if (intent === "DELAYED") {
    if (!count) {
      return "All shipments are currently on schedule with no delays detected in the system.";
    }

    const urgent = data.urgent?.product || "a shipment";

    return `There are ${count} delayed shipments being tracked, and the most critical issue involves ${urgent}, which requires immediate attention due to possible logistics or transit delays that may impact delivery timelines.`;
  }

  /* =========================
     INVENTORY
  ========================= */
  if (intent === "INVENTORY") {
    if (!count) {
      return "No inventory data is currently available.";
    }

    const first = data.items?.[0];

    return `The system is tracking ${count} inventory item(s), with ${first?.name} having ${first?.quantity} units currently available, reflecting active stock management across warehouse operations.`;
  }

  /* =========================
     PURCHASE ORDERS
  ========================= */
  if (intent === "PURCHASE_ORDERS") {
    if (!count) {
      return "There are currently no purchase orders in the system.";
    }

    const summary = (data.items || [])
      .map(
        r =>
          `order #${r.id} from ${r.supplier} placed on ${r.order_date} with status ${r.status} and total amount ${r.total_amount}`
      )
      .join(", ");

    return `There are ${count} purchase order(s) in the system, including ${summary}, all actively tracked within the procurement workflow for monitoring and processing.`;
  }

  /* =========================
     SUPPLIERS
  ========================= */
  if (intent === "SUPPLIERS") {
    const names = (data.items || []).map(i => i.name).join(", ");

    return `The system currently lists ${count} suppliers, including ${names}, which play a key role in maintaining smooth procurement and supply chain operations.`;
  }

  /* =========================
     FALLBACK
  ========================= */
  return `The system returned ${count} records, but the request could not be fully interpreted into a specific business category.`;
}

module.exports = { buildReply };