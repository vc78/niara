// Razorpay Payment Service
export const initializeRazorpay = async () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

export const handleRazorpayPayment = async (options) => {
    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!razorpayKeyId) {
        throw new Error('Razorpay Key ID not configured');
    }

    const options_obj = {
        key: razorpayKeyId,
        ...options
    };

    return new Promise((resolve, reject) => {
        const rzp = new window.Razorpay(options_obj);
        rzp.on('payment.failed', function (response) {
            reject(new Error(response.error.description));
        });
        rzp.open();
        resolve(true);
    });
};

export const generateRazorpayOrderId = async (amount, description, userDetails) => {
    // In a real app, this would call your backend API
    // For now, we'll generate a mock order ID format
    // Backend API example:
    // const response = await fetch('YOUR_BACKEND_URL/create-order', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ amount, description, userDetails })
    // });
    // return response.json();

    // Mock order ID generation (replace with actual backend call)
    const timestamp = Date.now();
    const orderId = `ORDER_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
    return orderId;
};
