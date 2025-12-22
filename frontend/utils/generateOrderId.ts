export const generateOrderId = () => {
    const date = new Date();
    const ymd = date.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(100000 + Math.random() * 900000);
    return `TRI-${ymd}-${random}`;
};
