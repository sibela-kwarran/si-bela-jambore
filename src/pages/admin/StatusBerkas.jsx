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

    try {

      // =====================================
      // AMBIL SEMUA GUDEP
      // =====================================

      const {
        data: gudep,
        error: gudepError
      } = await supabase
        .from("profil_gudep")
        .select("id");

      if (gudepError) {
        console.error(
          "ERROR GET GUDEP:",
          gudepError
        );
        return;
      }


      // =====================================
      // AMBIL SEMUA BERKAS
      // =====================================

      const {
        data: berkas,
        error: berkasError
      } = await supabase
        .from("berkas")
        .select("*");

      if (berkasError) {
        console.error(
          "ERROR GET BERKAS:",
          berkasError
        );
        return;
      }


      console.log(
        "SEMUA GUDEP:",
        gudep
      );

      console.log(
        "SEMUA BERKAS:",
        berkas
      );


      // =====================================
      // HITUNG STATUS PER GUDEP
      // =====================================

      let lengkap = 0;
      let menunggu = 0;
      let belum = 0;


      for (const itemGudep of gudep || []) {

        const dataBerkasGudep =
          (berkas || []).find(
            item =>
              Number(item.gudep_id) ===
              Number(itemGudep.id)
          );


        // Tidak ada data berkas
        if (!dataBerkasGudep) {

          belum++;

          continue;

        }


        const adaSuratTugas =
          Boolean(
            dataBerkasGudep.surat_tugas
          );

        const adaSuratIzin =
          Boolean(
            dataBerkasGudep.surat_izin
          );


        // =====================================
        // LENGKAP
        // =====================================

        if (
          adaSuratTugas &&
          adaSuratIzin
        ) {

          lengkap++;

        }

        // =====================================
        // MENUNGGU
        // =====================================

        else if (
          adaSuratTugas ||
          adaSuratIzin
        ) {

          menunggu++;

        }

        // =====================================
        // BELUM UPLOAD
        // =====================================

        else {

          belum++;

        }

      }


      // =====================================
      // PROGRESS
      // =====================================

      const totalGudep =
        gudep?.length || 0;


      const progress =
        totalGudep === 0
          ? 0
          : Math.round(
              (lengkap / totalGudep) * 100
            );


      console.log(
        "STATUS BERKAS:",
        {
          lengkap,
          menunggu,
          belum,
          totalGudep,
          progress
        }
      );


      setData({

        lengkap,

        menunggu,

        belum,

        progress,

      });


    } catch (error) {

      console.error(
        "STATUS BERKAS ERROR:",
        error
      );

    }

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

          <span>
            🟢 Lengkap
          </span>

          <span className="font-bold text-green-600">
            {data.lengkap} Gudep
          </span>

        </div>


        <div className="flex justify-between">

          <span>
            🟡 Menunggu
          </span>

          <span className="font-bold text-orange-500">
            {data.menunggu} Gudep
          </span>

        </div>


        <div className="flex justify-between">

          <span>
            🔴 Belum Upload
          </span>

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