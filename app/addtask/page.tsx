'use client'

import Image from "next/image";
import logo from "./../../assets/logo.png";
import Link from "next/link";
import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useState } from "react";

export default function Page() {
    //สร้างตัวแปร state เพื่อผูกกับข้อมูลที่จะเกิดขึ้นที่หน้าจอ และบันทึกลงฐานข้อมูล
    const [title, setTitle] = useState<string>("");
    const [detail, setDetail] = useState<string>("");
    const [is_completed, setIsCompleted] = useState<boolean>(false);
    const [image_file, setImageFile] = useState<File | null>(null);
    const [preview_file, setPreviewFile] = useState<string | null>(null);

    function handleSelectImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null;

        setImageFile(file);

        if (file) {
            setPreviewFile(URL.createObjectURL(file as Blob));
        }
    }

    async function handleUploadAndSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        alert('อัพโหลดรูปภาพและบันทึกข้อมูล');
    }



    return (
        <div>
            <div className="flex flex-col w-3/4 mx-auto">
                {/* Header */}
                <div className="flex flex-col items-center mt-20">
                    <Image src={logo} alt="logo" width={100} height={100} />
                    <h1 className="text-xl font-bold mt-8">Manage Task App</h1>
                    <h1 className="text-xl font-bold">บันทึกงานที่ต้องทำ</h1>
                </div>

                <form onSubmit={handleUploadAndSave}>
                    <div className="mt-10 flex flex-col border border-gray-300 p-5 rounded-lg shadow">
                        <h1 className="text-center text-xl font-bold mb-5">เพิ่มงานใหม่</h1>

                        <div className="flex flex-col mt-3">
                            <label className="text-lg font-bold">งานที่ทำ</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-2"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col mt-3">
                            <label className="text-lg font-bold">รายละเอียดงาน</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-2"
                                value={detail}
                                onChange={(e) => setDetail(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col mt-3">
                            <label className="text-lg font-bold">อัพโหลดรูปภาพ</label>
                            <input
                                id="fileInput"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleSelectImagePreview}
                            />
                            <label
                                htmlFor="fileInput"
                                className="bg-blue-500 rounded-lg p-2 text-white cursor-pointer w-32 text-center mt-2"
                            >
                                เลือกรูป
                            </label>

                            {preview_file && (
                                <div className="mt-3">
                                    <Image
                                        src={preview_file}
                                        alt="preview"
                                        width={100}
                                        height={100}
                                        className="rounded-lg object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col mt-3">
                            <label className="text-lg font-bold">สถานะงาน</label>
                            <select
                                className="border border-gray-300 rounded-lg p-2"
                                value={is_completed ? "1" : "0"}
                                onChange={(e) => setIsCompleted(e.target.value === "1")}
                            >
                                <option value="0">ยังไม่เสร็จสิ้น</option>
                                <option value="1">เสร็จสิ้น</option>
                            </select>
                        </div>

                        <div className="flex flex-col mt-5">
                            <button className="bg-green-500 rounded-lg p-2 text-white hover:bg-green-600">
                                บันทึกเพิ่มงาน
                            </button>
                        </div>
                    </div>
                </form>


                <div className="flex justify-center mt-10">
                    <Link href="/alltask" className="text-blue-600 font-bold"> กลับไปแสดงงานทั้งหมด </Link>
                </div>

            </div>
        </div>

    );
}
