export const sendOrderToWhatsApp = ({
    orderId,
    address,
    products,
    totalAmount,
    phone,
    orderType,
}: any) => {
    const whatsappNumber = "919345830932"; // TRIIIO WhatsApp number

    const productText = products
        .map(
            (item: any, index: number) => `
${index + 1}) ${item.name}
   Size: ${item.size}
   Color: ${item.color}
   Qty: ${item.quantity}
   Price: ₹${item.price}
   🖼️ Image:
   ${item.image}`
        )
        .join("\n");

    const message = `
🛍️ *NEW ORDER - TRIIIO*

🆔 *Order ID:*
${orderId}

👤 *Customer Name:*
${address.name}

📞 *Phone:*
${phone}

📍 *Delivery Address:*
${address.street},
${address.city},
${address.state} - ${address.pincode}

🛒 *Order Type:*
${orderType}

📦 *Products:*
${productText}

💰 *Total Amount:*
₹${totalAmount}

🕒 *Order Time:*
${new Date().toLocaleString()}
`;

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
    )}`;

    window.open(whatsappURL, "_blank");
};
