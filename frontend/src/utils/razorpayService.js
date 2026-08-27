let razorpayScriptPromise;

export const initializeRazorpay = async () => {
    if (typeof window !== 'undefined' && window.Razorpay) return true;
    if (razorpayScriptPromise) return razorpayScriptPromise;

    razorpayScriptPromise = new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(Boolean(window.Razorpay));
        script.onerror = () => {
            razorpayScriptPromise = undefined;
            resolve(false);
        };
        document.body.appendChild(script);
    });

    return razorpayScriptPromise;
};

export const handleRazorpayPayment = async (options) => {
    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TDnNEoRLz2m96G';

    if (!razorpayKeyId) {
        throw new Error('Razorpay Key ID not configured');
    }

    if (!window.Razorpay) {
        throw new Error('Razorpay could not be loaded. Check your internet connection and try again.');
    }

    const options_obj = {
        key: razorpayKeyId,
        ...options
    };

    return new Promise((resolve, reject) => {
        let settled = false;
        const settle = (callback, value) => {
            if (!settled) {
                settled = true;
                callback(value);
            }
        };

        try {
            const originalHandler = options_obj.handler;
            const rzp = new window.Razorpay({
                ...options_obj,
                handler: async (response) => {
                    try {
                        await originalHandler?.(response);
                        settle(resolve, true);
                    } catch (error) {
                        settle(reject, error);
                    }
                }
            });
            rzp.on('payment.failed', (response) => {
                settle(reject, new Error(response?.error?.description || 'Payment failed.'));
            });
            rzp.on('modal.dismiss', () => {
                settle(reject, new Error('Payment window was closed.'));
            });
            rzp.open();
        } catch (error) {
            settle(reject, error);
        }
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
