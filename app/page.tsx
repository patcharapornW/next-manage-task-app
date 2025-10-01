import Image from "next/image";
import logo from "./../assets/logo.png";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {/* โลโก้ */}
      <Image
        src={logo}
        alt="logo"
        width={150}
        height={150}
        className="mb-8"
      />

      {/* ข้อความหัวเรื่อง */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Manage Task App
      </h1>
      <h2 className="text-xl text-gray-600 mb-8">
        บันทึกงานที่ต้องทำ
      </h2>

      {/* ปุ่มเข้าใช้งาน */}
      <Link
        href="/alltask"
        className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-lg transition-all shadow-md"
      >
        เข้าใช้งาน
      </Link>
    </div>
  );
}
