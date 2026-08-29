import { jsPDF } from 'jspdf';

const BRAND_NAME = 'LABEL by SAHITHI NANDAN';
const CONTACT_PHONE = '9000164752';

const safeText = (value, fallback = 'Not provided') => {
    if (value === undefined || value === null || value === '') return fallback;
    return String(value);
};

const formatCurrency = (value) => {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return 'Rs. 0';
    return `Rs. ${Math.round(amount).toLocaleString('en-IN')}`;
};

const normalizePrice = (val) => {
    if (typeof val === 'number') return Number.isFinite(val) ? val : 0;
    if (!val) return 0;
    const cleaned = String(val).replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return Number.isFinite(num) ? num : 0;
};

const normalizeItems = (items = []) => {
    if (!Array.isArray(items)) return [];
    return items
        .map((item) => {
            if (!item) return null;
            const price = normalizePrice(item.price ?? item.unitPrice ?? item.sellingPrice);
            const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
            return {
                name: safeText(item.name || item.title, 'Product'),
                size: safeText(item.size, 'Free Size'),
                quantity,
                unitPrice: price
            };
        })
        .filter((item) => item !== null && item.quantity > 0);
};

export const createInvoiceOrder = ({
    customer,
    items,
    cart,
    paymentMethod,
    paymentStatus,
    paymentId,
    orderId,
    total,
    subtotal: customSubtotal,
    discount: customDiscount,
    deliveryCharge = 0
}) => {
    const rawItems = (Array.isArray(items) && items.length > 0) ? items : (Array.isArray(cart) ? cart : []);
    const normalizedItems = normalizeItems(rawItems);
    const calculatedSubtotal = normalizedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const subtotal = Number.isFinite(Number(customSubtotal)) ? Number(customSubtotal) : calculatedSubtotal;
    
    const passedTotal = Number(total ?? customer?.totalAmount);
    const safeTotal = Number.isFinite(passedTotal) ? passedTotal : calculatedSubtotal;
    const discount = Number.isFinite(Number(customDiscount)) ? Number(customDiscount) : Math.max(0, subtotal - safeTotal);

    if (!normalizedItems.length) {
        throw new Error('Your order has no valid items.');
    }

    return {
        orderId: safeText(orderId, `SN-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`),
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
        discount,
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
    doc.text('Thank you for shopping with LABEL by SAHITHI NANDAN.', margin, 284);
    doc.setTextColor(100, 100, 100);
    doc.text(`WhatsApp: +91 ${CONTACT_PHONE}`, margin, 290);

    return doc.output('blob');
};

export const invoiceFileName = (order) => `LABEL-BY-SAHITHI-NANDAN-${safeText(order?.orderId, 'invoice')}.pdf`;

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
        text: `Your LABEL by SAHITHI NANDAN order confirmation - ${order.orderId}`
    });
    return true;
};

export const openWhatsAppWithOrder = (order) => {
    const items = order.items.map((item) => `- ${item.name} | Size: ${item.size} | Qty: ${item.quantity} | ${formatCurrency(item.unitPrice * item.quantity)}`).join('\n');
    const address = `${safeText(order.customer.address)}, ${safeText(order.customer.city)}, ${safeText(order.customer.state)} - ${safeText(order.customer.pincode)}`;
    const paymentLine = order.paymentStatus === 'PENDING'
        ? `Payment method: ${order.paymentMethod} (to be collected)`
        : `Payment: ${formatCurrency(order.total)} - ${order.paymentStatus}`;
    const text = `NEW ORDER - ${BRAND_NAME}\n------------------\nOrder ID: ${order.orderId}\n\nCUSTOMER\nName: ${safeText(order.customer.name)}\nPhone: ${safeText(order.customer.mobile)}\nEmail: ${safeText(order.customer.email)}\nAddress: ${address}\nLandmark: ${safeText(order.customer.landmark, 'N/A')}\n\nORDER DETAILS\n${items}\n\nSubtotal: ${formatCurrency(order.subtotal)}\n${order.discount > 0 ? `Discount: -${formatCurrency(order.discount)}\n` : ''}${paymentLine}\nTotal: ${formatCurrency(order.total)}\n\nInvoice is available from the order confirmation screen.`;
    window.open(`https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
};
