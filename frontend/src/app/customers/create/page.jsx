"use client";
import { useRef, useState, useEffect } from "react"; // ⭐ 追加
import { useRouter } from "next/navigation";

import createCustomer from "./createCustomer";

export default function CreatePage() {
  const formRef = useRef();
  const router = useRouter();

  // ⭐ 追加：各フィールドのstate（リアルタイムに監視）
  const [customerName, setCustomerName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  // ⭐ 追加：全フィールドが入力されているかどうかを判定
  const isDisabled =
    !customerName.trim() ||
    !customerId.trim() ||
    !age.trim() ||
    !gender.trim();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    await createCustomer(formData);
    router.push(`./create/confirm?customer_id=${formData.get("customer_id")}`);
  };

  return (
    <>
      <div className="card bordered bg-white border-blue-200 border-2 max-w-md m-4">
        <div className="m-4 card bordered bg-blue-200 duration-200 hover:border-r-red">
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="card-body">
              <h2 className="card-title">
                <p>
                  <input
                    type="text"
                    name="customer_name"
                    placeholder="桃太郎"
                    className="input input-bordered"
                    value={customerName} // ⭐ 追加
                    onChange={(e) => setCustomerName(e.target.value)} // ⭐ 追加
                  />
                </p>
              </h2>
              <p>
                Customer ID:
                <input
                  type="text"
                  name="customer_id"
                  placeholder="C030"
                  className="input input-bordered"
                  value={customerId} // ⭐ 追加
                  onChange={(e) => setCustomerId(e.target.value)} // ⭐ 追加
                />
              </p>
              <p>
                Age:
                <input
                  type="number"
                  name="age"
                  placeholder="30"
                  className="input input-bordered"
                  value={age} // ⭐ 追加
                  onChange={(e) => setAge(e.target.value)} // ⭐ 追加
                />
              </p>
              <p>
                Gender:
                <input
                  type="text"
                  name="gender"
                  placeholder="女"
                  className="input input-bordered"
                  value={gender} // ⭐ 追加
                  onChange={(e) => setGender(e.target.value)} // ⭐ 追加
                />
              </p>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="btn btn-primary m-4 text-2xl"
                disabled={isDisabled} // ⭐ 追加：未入力があるとボタン無効
              >
                作成
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
