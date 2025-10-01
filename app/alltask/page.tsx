'use client'

import Image from "next/image";
import logo from "./../../assets/logo.png";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Task = {
  id: string;
  title: string;
  detail: string;
  is_completed: boolean;
  image_url: string;
  created_at: string;
  update_at: string; // ✅ เปลี่ยนเป็น updated_at ให้ตรง Supabase
};

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      const { data, error } = await supabase
        .from("task_tb")
        .select("id, title, detail, is_completed, image_url, created_at, update_at")
        .order("created_at", { ascending: false });

      if (error) {
        alert("พบปัญหาในการดึงข้อมูลจาก Supabase");
        console.error(error);
        return;
      }

      if (data) {
        setTasks(data as Task[]);
      }
    }

    fetchTasks(); // ✅ เรียกใช้งานจริง
  }, []);

  return (
    <>
      <div className="flex flex-col w-3/4 mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mt-20">
          <Image src={logo} alt="logo" width={100} height={100} />
          <h1 className="text-xl font-bold mt-8">Manage Task App</h1>
          <h1 className="text-xl font-bold">บันทึกงานที่ต้องทำ</h1>
        </div>

        <div className="flex justify-end">
          <Link
            href="/addtask"
            className="mt-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-max rounded"
          >
            เพิ่มงาน
          </Link>
        </div>

        {/* ตารางแสดงข้อมูล */}
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full border border-black text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-black p-2">รูป</th>
                <th className="border border-black p-2">งานที่ต้องทำ</th>
                <th className="border border-black p-2">รายละเอียด</th>
                <th className="border border-black p-2">สถานะ</th>
                <th className="border border-black p-2">วันที่เพิ่ม</th>
                <th className="border border-black p-2">วันที่แก้ไข</th>
                <th className="border border-black p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {
                tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-100">
                    <td className="border border-black p-2 text-center">
                      {task.image_url ? (
                        <Image
                          src={task.image_url}
                          alt="task"
                          width={50}
                          height={50}
                          className="mx-auto rounded"
                        />
                      ) : (
                        "."
                      )}
                    </td>
                    <td className="border border-black p-2">{task.title}</td>
                    <td className="border border-black p-2">{task.detail}</td>
                    <td className="border border-black p-2">
                      {task.is_completed ? "เสร็จสิ้น" : "ยังไม่เสร็จสิ้น"}
                    </td>
                    <td className="border border-black p-2">
                      {new Date(task.created_at).toLocaleDateString()}
                    </td>
                    <td className="border border-black p-2">
                      {new Date(task.update_at).toLocaleDateString()}
                    </td>
                    <td className="border border-black p-2 text-center space-x-2">
                      <Link href="#" >แก้ไข</Link>
                      <button className="text-red-600">ลบ</button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-10">
            <Link href="/" className="text-blue-600 font-bold"> กลับไปหน้าแรก </Link>
        </div>
      </div>
    </>
  );
}
