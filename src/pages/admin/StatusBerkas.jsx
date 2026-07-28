import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";
import { FaFolderOpen } from "react-icons/fa";

export default function StatusBerkas() {

  const [data, setData] = useState({
    lengkap: 0,
    menunggu: 0,
    belum: 0,
    progress: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    const { data: berkas, error } = await supabase
      .from("berkas")
      .select("*");

    if (error) {
      console.log(error);
      return;
    }

    const lengkap = berkas.filter(
      (item) => item.status === "Lengkap"
    ).length;

    const menunggu = berkas.filter(
      (item) => item.status === "Menunggu"
    ).length;

    const belum = berkas.length - lengkap - menunggu;

    const progress =
      berkas.length === 0
        ? 0
        : Math.round((lengkap / berkas.length) * 100);

    setData({
      lengkap,
      menunggu,
      belum,
      progress,
    });
  }

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex items-center gap-3 mb-5">

        <FaFolderOpen
          className="text-amber-600"
          size={28}
        />

        <h2 className="text-xl font-bold">
          Status Berkas
        </h2>

      </div>

      <div className="space-y-3">

        <div className="flex justify-between">

          <span>🟢 Lengkap</span>

          <span className="font-bold text-green-600">
            {data.lengkap} Gudep
          </span>

        </div>

        <div className="flex justify-between">

          <span>🟡 Menunggu</span>

          <span className="font-bold text-orange-500">
            {data.menunggu} Gudep
          </span>

        </div>

        <div className="flex justify-between">

          <span>🔴 Belum Upload</span>

          <span className="font-bold text-red-600">
            {data.belum} Gudep
          </span>

        </div>

        <div className="mt-5">

          <div className="w-full bg-gray-200 rounded-full h-4">

            <div
              className="bg-amber-500 h-4 rounded-full transition-all duration-700"
              style={{
                width: `${data.progress}%`,
              }}
            />

          </div>

          <p className="text-center mt-2 font-semibold text-amber-700">

            Progress Berkas {data.progress}%

          </p>

        </div>

      </div>

    </div>

  );

}