'use client'

import Image from "next/image";
import logo from "./../../../assets/logo.png";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "./../../../lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { id } = useParams(); // Destructure id ให้ใช้งานง่ายขึ้น

  //--- States ---
  const [title, setTitle] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [is_completed, setIsCompleted] = useState<boolean>(false);
  const [image_file, setImageFile] = useState<File | null>(null);
  const [preview_file, setPreviewFile] = useState<string | null>(null);
  const [old_image_url, setOldImageUrl] = useState<string | null>(null); // [แก้ไข] เปลี่ยนชื่อเพื่อความชัดเจน

  //--- ดึงข้อมูลเริ่มต้นมาแสดง ---
  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      const { data, error } = await supabase
        .from("task_tb")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("พบปัญหาในการดึงข้อมูล หรือไม่พบข้อมูลนี้");
        console.log(error.message);
        router.push("/alltask");
        return;
      }

      // นำข้อมูลที่ดึงมาได้ มาใส่ใน State
      setTitle(data.title);
      setDetail(data.detail);
      setIsCompleted(data.is_completed);
      setPreviewFile(data.image_url);
      setOldImageUrl(data.image_url); // [สำคัญ] เก็บ URL รูปเก่าไว้ใน State
    }
    fetchData();
  }, [id]); // ✅ [สำคัญมาก] ใส่ dependency array เพื่อป้องกัน Infinite Loop

  //--- จัดการเมื่อมีการเลือกรูปใหม่ ---
  function handleSelectImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      setPreviewFile(URL.createObjectURL(file));
    } else {
      setPreviewFile(old_image_url); // ถ้ากดยกเลิก ให้แสดงรูปเก่า
    }
  }

  //--- ฟังก์ชันหลัก: จัดการการอัปเดตข้อมูลทั้งหมด ---
  async function handleUploadAndUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let final_image_url = old_image_url; // 1. กำหนด URL รูปภาพเริ่มต้นให้เป็นรูปเก่าเสมอ

    // 2. ถ้ามีการเลือก "ไฟล์รูปใหม่" (image_file มีค่า) ให้ทำส่วนนี้
    if (image_file) {
      // 2.1 ลบรูปเก่าออกจาก Storage (ถ้ามีรูปเก่าอยู่)
      if (old_image_url) {
        const oldImageName = old_image_url.split('/').pop();
        if (oldImageName) {
          await supabase.storage.from("task_bk").remove([oldImageName]);
        }
      }

      // 2.2 อัปโหลดรูปใหม่
      const new_image_file_name = `${Date.now()}-${image_file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("task_bk")
        .upload(new_image_file_name, image_file);

      if (uploadError) {
        alert("พบปัญหาในการอัพโหลดรูปใหม่");
        console.log(uploadError.message);
        return;
      }

      // 2.3 ดึง Public URL ของรูปใหม่มาเป็น URL สุดท้าย
      const { data: urlData } = supabase.storage
        .from("task_bk")
        .getPublicUrl(new_image_file_name);
      final_image_url = urlData.publicUrl;
    }

    // 3. อัปเดตข้อมูลลงตาราง task_tb ใน Database
    const { error: updateError } = await supabase
      .from("task_tb")
      .update({
        title: title,
        detail: detail,
        is_completed: is_completed,
        image_url: final_image_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id); // ✅ [สำคัญมาก] ระบุว่าจะ update แถวไหน

    if (updateError) {
      alert("พบปัญหาในการอัปเดตข้อมูล");
      console.log(updateError.message);
      return;
    }

    alert("แก้ไขข้อมูลสำเร็จ");
    router.push("/alltask");
  }

  return (
    <div>
      <div className="flex flex-col w-3/4 mx-auto">
        <div className="flex flex-col items-center mt-20">
          <Image src={logo} alt="logo" width={100} height={100} />
          <h1 className="text-xl font-bold mt-8">Manage Task App</h1>
          <h1 className="text-xl font-bold">แก้ไขงาน</h1>
        </div>

        <form onSubmit={handleUploadAndUpdate}>
          <div className="mt-10 flex flex-col border border-gray-300 p-5 rounded-lg shadow">
            <h1 className="text-center text-xl font-bold mb-5">ฟอร์มแก้ไขงาน</h1>

            {/* Input Title */}
            <div className="flex flex-col mt-3">
              <label className="text-lg font-bold">งานที่ทำ</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg p-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Input Detail */}
            <div className="flex flex-col mt-3">
              <label className="text-lg font-bold">รายละเอียดงาน</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg p-2"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
              />
            </div>

            {/* Input Image */}
            <div className="flex flex-col mt-3">
              <label className="text-lg font-bold">อัพโหลดรูปภาพ</label>
              <input
                id="fileInput" type="file" className="hidden"
                accept="image/*" onChange={handleSelectImagePreview}
              />
              <label htmlFor="fileInput" className="bg-blue-500 rounded-lg p-2 text-white cursor-pointer w-32 text-center mt-2">
                เปลี่ยนรูป
              </label>
              {preview_file && (
                <div className="mt-3">
                  <Image src={preview_file} alt="preview" width={100} height={100} className="rounded-lg object-cover" />
                </div>
              )}
            </div>

            {/* Select Status */}
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

            {/* Submit Button */}
            <div className="flex flex-col mt-5">
              <button type="submit" className="bg-green-500 rounded-lg p-2 text-white hover:bg-green-600">
                บันทึกแก้ไขงาน
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