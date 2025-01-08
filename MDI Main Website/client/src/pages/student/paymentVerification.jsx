import VerifyingLoader from "@/components/verifyingLoader";
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const navigate = useNavigate();

  useEffect(() => {
    async function verifyPayment() {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payments/verify/${reference}`);
      const { success, data } = await response.json();

      if (success) {
        console.log("Payment Verified:", data);
        navigate("/student/course/mycourses");
      } else {
        console.error("Payment verification failed");
      }
    }

    if (reference) verifyPayment();
  }, [reference, navigate]);

  return <VerifyingLoader/>;
}

export default PaymentSuccessPage;
