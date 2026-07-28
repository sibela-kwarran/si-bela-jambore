import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";
import { FaBell } from "react-icons/fa";

export default function AktivitasHariIni() {

  const [data, setData] = useState({
    gudep: 0,
    peserta: 0,
    pembayaran: 0,
    berkas: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    const hariIni = new Date();

    hariIni.setHours(0,0,0,0);

    const tanggal =
      hariIni.toISOString();

    const [
      gudep,
      peserta,
      pembayaran,
      berkas
    ] = await Promise.all([

      supabase
      .from("profil_gudep")
      .select("id")
      .gte("created_at",tanggal),

      supabase
      .from("peserta")
      .select("id")
      .gte("created_at",tanggal),

      supabase
      .from("pembayaran")
      .select("id")
      .gte("created_at",tanggal),

      supabase
      .from("berkas")
      .select("id")
      .gte("created_at",tanggal),

    ]);

    setData({

      gudep:
      gudep.data?.length || 0,

      peserta:
      peserta.data?.length || 0,

      pembayaran:
      pembayaran.data?.length || 0,

      berkas:
      berkas.data?.length || 0,

    });

  }

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex items-center gap-3 mb-5">

        <FaBell
          className="text-blue-600"
          size={28}
        />

        <h2 className="text-xl font-bold">

          Aktivitas Hari Ini

        </h2>

      </div>

      <div className="space-y-4">

        <div className="flex justify-between">

          <span>🏕 Gudep Baru</span>

          <span className="font-bold text-blue-600">

            {data.gudep}

          </span>

        </div>

        <div className="flex justify-between">

          <span>👥 Peserta Baru</span>

          <span className="font-bold text-green-600">

            {data.peserta}

          </span>

        </div>

        <div className="flex justify-between">

          <span>💰 Pembayaran Baru</span>

          <span className="font-bold text-purple-600">

            {data.pembayaran}

          </span>

        </div>

        <div className="flex justify-between">

          <span>📂 Berkas Baru</span>

          <span className="font-bold text-orange-600">

            {data.berkas}

          </span>

        </div>

      </div>

    </div>

  );

}