
export async function submitKYC(data: {
  farmer_id: string;
  aadhaar_number: string;
  pan_number: string;
  address: string;
}) {
  const res = await fetch("http://localhost:4000/api/submit-kyc", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
