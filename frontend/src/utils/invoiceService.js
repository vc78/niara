import { jsPDF } from 'jspdf';

const BRAND_NAME = 'SREE VASTRA';
const CONTACT_PHONE = '9032306961';
const CONTACT_EMAIL = 'venkatchowdary9177@gmail.com';

const safeText = (value, fallback = 'Not provided') => {
    if (value === undefined || value === null || value === '') return fallback;
    return String(value);
};

const formatCurrency = (value) => {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return 'Rs. 0';
    return `Rs. ${Math.round(amount).toLocaleString('en-IN')}`;
};

const normalizeItems = (items = []) => items
    .filter((item) => item && Number(item.quantity) > 0 && Number.isFinite(Number(item.price)))
    .map((item) => ({
        name: safeText(item.name, 'Product'),
        size: safeText(item.size, 'Free Size'),
        quantity: Math.max(1, Math.floor(Number(item.quantity))),
        unitPrice: Number(item.price)
    }));

export const createInvoiceOrder = ({ customer, items, paymentMethod, paymentStatus, paymentId, orderId }) => {
    const normalizedItems = normalizeItems(items);
    const subtotal = normalizedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const total = Number(customer?.totalAmount);
    const safeTotal = Number.isFinite(total) ? total : subtotal;

    if (!normalizedItems.length) throw new Error('Your order has no valid items.');

    return {
        orderId: safeText(orderId, `SV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`),
        createdAt: new Date().toISOString(),
        customer: {
            name: safeText(customer?.name),
            email: safeText(customer?.email),
            mobile: safeText(customer?.mobile),
            address: safeText(customer?.address),
            city: safeText(customer?.city),
            state: safeText(customer?.state),
            pincode: safeText(customer?.pincode),
            landmark: safeText(customer?.landmark, 'N/A'),
            totalAmount: safeTotal
        },
        items: normalizedItems,
        subtotal,
        discount: Math.max(0, subtotal - safeTotal),
        total: safeTotal,
        paymentMethod: safeText(paymentMethod, 'Online Payment'),
        paymentStatus: safeText(paymentStatus, 'SUCCESSFUL'),
        paymentId: paymentId ? String(paymentId) : ''
    };
};

export const generateInvoicePdf = (order) => {
    if (!order?.items?.length) throw new Error('Unable to generate an invoice for an empty order.');

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;
    let y = 18;

    doc.setFillColor(37, 37, 96);
    doc.rect(0, 0, pageWidth, 12, 'F');
    doc.setTextColor(37, 37, 96);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(BRAND_NAME, margin, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Handcrafted Indian fashion', margin, y + 11);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(37, 37, 96);
    doc.text('ORDER CONFIRMATION / INVOICE', pageWidth - margin, y + 5, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Order ID: ${order.orderId}`, pageWidth - margin, y + 11, { align: 'right' });
    y += 28;

    doc.setDrawColor(201, 168, 76);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('ORDER DATE', margin, y);
    doc.text('PAYMENT STATUS', pageWidth / 2, y);
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.text(new Date(order.createdAt).toLocaleString('en-IN'), margin, y);
    doc.setTextColor(16, 140, 90);
    doc.text(order.paymentStatus, pageWidth / 2, y);
    y += 13;

    doc.setFillColor(248, 246, 240);
    doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(37, 37, 96);
    doc.text('CUSTOMER DETAILS', margin + 5, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(55, 55, 55);
    doc.text(`Name: ${safeText(order.customer.name)}`, margin + 5, y + 14);
    doc.text(`Phone: ${safeText(order.customer.mobile)}`, margin + 5, y + 20);
    doc.text(`Email: ${safeText(order.customer.email)}`, margin + 5, y + 26);
    const address = `${safeText(order.customer.address)}, ${safeText(order.customer.city)}, ${safeText(order.customer.state)} - ${safeText(order.customer.pincode)}`;
    doc.text(doc.splitTextToSize(`Address: ${address}`, contentWidth / 2 - 8), pageWidth / 2, y + 14);
    doc.text(`Landmark: ${safeText(order.customer.landmark, 'N/A')}`, pageWidth / 2, y + 28);
    y += 48;

    doc.setFillColor(37, 37, 96);
    doc.rect(margin, y, contentWidth, 9, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('PRODUCT', margin + 4, y + 6);
    doc.text('SIZE', margin + contentWidth * 0.57, y + 6);
    doc.text('QTY', margin + contentWidth * 0.69, y + 6);
    doc.text('UNIT PRICE', margin + contentWidth * 0.77, y + 6);
    doc.text('TOTAL', pageWidth - margin - 4, y + 6, { align: 'right' });
    y += 9;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    order.items.forEach((item, index) => {
        const rowHeight = Math.max(10, doc.splitTextToSize(item.name, contentWidth * 0.48).length * 4 + 5);
        if (y + rowHeight > 270) {
            doc.addPage();
            y = 20;
        }
        if (index % 2 === 0) {
            doc.setFillColor(252, 251, 248);
            doc.rect(margin, y, contentWidth, rowHeight, 'F');
        }
        doc.setTextColor(50, 50, 50);
        doc.text(doc.splitTextToSize(item.name, contentWidth * 0.48), margin + 4, y + 6);
        doc.text(item.size, margin + contentWidth * 0.57, y + 6);
        doc.text(String(item.quantity), margin + contentWidth * 0.69, y + 6);
        doc.text(formatCurrency(item.unitPrice), margin + contentWidth * 0.77, y + 6);
        doc.text(formatCurrency(item.unitPrice * item.quantity), pageWidth - margin - 4, y + 6, { align: 'right' });
        y += rowHeight;
    });

    y += 8;
    const summaryX = pageWidth - margin - 72;
    doc.setDrawColor(220, 215, 200);
    doc.line(summaryX, y, pageWidth - margin, y);
    y += 7;
    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    doc.text('Subtotal', summaryX, y);
    doc.text(formatCurrency(order.subtotal), pageWidth - margin, y, { align: 'right' });
    if (order.discount > 0) {
        y += 6;
        doc.text('Discount', summaryX, y);
        doc.text(`-${formatCurrency(order.discount)}`, pageWidth - margin, y, { align: 'right' });
    }
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(37, 37, 96);
    doc.text('GRAND TOTAL', summaryX, y);
    doc.text(formatCurrency(order.total), pageWidth - margin, y, { align: 'right' });
    y += 9;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(75, 75, 75);
    doc.text(`Payment: ${order.paymentMethod}`, summaryX, y);
    if (order.paymentId) doc.text(`Payment ID: ${order.paymentId}`, summaryX, y + 5);

    doc.setDrawColor(201, 168, 76);
    doc.line(margin, 276, pageWidth - margin, 276);
    doc.setFontSize(9);
    doc.setTextColor(37, 37, 96);
    doc.text('Thank you for shopping with SREE VASTRA.', margin, 284);
    doc.setTextColor(100, 100, 100);
    doc.text(`${CONTACT_PHONE}  |  ${CONTACT_EMAIL}`, margin, 290);

    return doc.output('blob');
};

export const invoiceFileName = (order) => `SREE-VASTRA-${safeText(order?.orderId, 'invoice')}.pdf`;

export const downloadInvoicePdf = (order, blob) => {
    const url = URL.createObjectURL(blob || generateInvoicePdf(order));
    const link = document.createElement('a');
    link.href = url;
    link.download = invoiceFileName(order);
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const shareInvoicePdf = async (order, blob) => {
    const invoiceBlob = blob || generateInvoicePdf(order);
    const file = new File([invoiceBlob], invoiceFileName(order), { type: 'application/pdf' });
    if (!navigator.share || !navigator.canShare?.({ files: [file] })) return false;
    await navigator.share({
        files: [file],
        title: `${BRAND_NAME} Invoice ${order.orderId}`,
        text: `Your SREE VASTRA order confirmation - ${order.orderId}`
    });
    return true;
};

export const openWhatsAppWithOrder = (order) => {
    const text = `Hi ${safeText(order.customer.name, 'there')}!\n\nThank you for your order from ${BRAND_NAME}.\n\nOrder ID: ${order.orderId}\nPayment: ${formatCurrency(order.total)} successfully received.\n\nYour order confirmation invoice is ready to download/share.\n\nThank you for shopping with ${BRAND_NAME}!`;
    window.open(`https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
};
