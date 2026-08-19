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


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    loadData();

  }, []);


  async function loadData() {

    try {

      // =================================================
      // 1. AMBIL GUDEP YANG SUDAH MENGIRIM PENDAFTARAN
      // =================================================

      const {
        data: pendaftaran,
        error: pendaftaranError
      } = await supabase
        .from("pendaftaran")
        .select(`
          id,
          gudep_id,
          status,
          tanggal_kirim
        `)
        .not("gudep_id", "is", null)
        .order("id", {
          ascending: false
        });


      if (pendaftaranError) {

        console.error(
          "ERROR GET PENDAFTARAN:",
          pendaftaranError
        );

        return;

      }


      // =================================================
      // 2. HINDARI GUDEP GANDA
      //
      // Karena diurutkan id DESC,
      // data pendaftaran terbaru digunakan.
      // =================================================

      const pendaftaranMap =
        new Map();


      (pendaftaran || []).forEach(
        (item) => {

          const gudepId =
            Number(item.gudep_id);


          if (
            gudepId &&
            !pendaftaranMap.has(gudepId)
          ) {

            pendaftaranMap.set(
              gudepId,
              item
            );

          }

        }
      );


      const gudepIds =
        Array.from(
          pendaftaranMap.keys()
        );


      console.log(
        "GUDEP RESMI STATUS BERKAS:",
        gudepIds
      );


      // =================================================
      // 3. JIKA BELUM ADA GUDEP RESMI
      // =================================================

      if (
        gudepIds.length === 0
      ) {

        setData({
          lengkap: 0,
          menunggu: 0,
          belum: 0,
          progress: 0,
        });

        return;

      }


      // =================================================
      // 4. AMBIL BERKAS
      // =================================================
      //
      // Hanya berkas milik Gudep resmi.
      // =================================================

      const {
        data: berkas,
        error: berkasError
      } = await supabase
        .from("berkas")
        .select(`
          id,
          gudep_id,
          surat_tugas,
          surat_izin
        `)
        .in(
          "gudep_id",
          gudepIds
        );


      if (berkasError) {

        console.error(
          "ERROR GET BERKAS:",
          berkasError
        );

        return;

      }


      console.log(
        "BERKAS GUDEP RESMI:",
        berkas
      );


      // =================================================
      // 5. HITUNG STATUS PER GUDEP
      // =================================================

      let lengkap = 0;
      let menunggu = 0;
      let belum = 0;


      for (
        const gudepId of gudepIds
      ) {

        // ===============================================
        // Cari berkas Gudep
        // ===============================================

        const dataBerkasGudep =
          (berkas || []).find(
            item =>
              Number(item.gudep_id) ===
              Number(gudepId)
          );


        // ===============================================
        // BELUM ADA DATA BERKAS
        // ===============================================

        if (!dataBerkasGudep) {

          belum++;

          continue;

        }


        // ===============================================
        // CEK SURAT TUGAS
        // ===============================================

        const adaSuratTugas =
          Boolean(
            dataBerkasGudep.surat_tugas
          );


        // ===============================================
        // CEK SURAT IZIN
        // ===============================================

        const adaSuratIzin =
          Boolean(
            dataBerkasGudep.surat_izin
          );


        // ===============================================
        // LENGKAP
        // ===============================================

        if (
          adaSuratTugas &&
          adaSuratIzin
        ) {

          lengkap++;

        }


        // ===============================================
        // MENUNGGU
        // Salah satu sudah upload
        // ===============================================

        else if (
          adaSuratTugas ||
          adaSuratIzin
        ) {

          menunggu++;

        }


        // ===============================================
        // BELUM UPLOAD
        // ===============================================

        else {

          belum++;

        }

      }


      // =================================================
      // 6. TOTAL GUDEP RESMI
      // =================================================

      const totalGudep =
        gudepIds.length;


      // =================================================
      // 7. PROGRESS
      //
      // Berdasarkan Gudep yang berkasnya LENGKAP.
      // =================================================

      const progress =
        totalGudep === 0
          ? 0
          : Math.round(
              (
                lengkap /
                totalGudep
              ) * 100
            );


      // =================================================
      // 8. DEBUG
      // =================================================

      console.log(
        "======================================"
      );

      console.log(
        "STATUS BERKAS ADMIN FINAL"
      );

      console.log(
        "Gudep Resmi:",
        totalGudep
      );

      console.log(
        "Lengkap:",
        lengkap
      );

      console.log(
        "Menunggu:",
        menunggu
      );

      console.log(
        "Belum Upload:",
        belum
      );

      console.log(
        "Total Status:",
        lengkap +
        menunggu +
        belum
      );

      console.log(
        "Progress:",
        progress + "%"
      );

      console.log(
        "======================================"
      );


      // =================================================
      // 9. SIMPAN DATA
      // =================================================

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


  // =====================================================
  // TAMPILAN
  // =====================================================

  return (

    <div className="bg-white rounded-xl shadow p-6">


      {/* HEADER */}

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


        {/* LENGKAP */}

        <div className="flex justify-between">

          <span>
            🟢 Lengkap
          </span>

          <span className="font-bold text-green-600">

            {data.lengkap} Gudep

          </span>

        </div>


        {/* MENUNGGU */}

        <div className="flex justify-between">

          <span>
            🟡 Menunggu
          </span>

          <span className="font-bold text-orange-500">

            {data.menunggu} Gudep

          </span>

        </div>


        {/* BELUM UPLOAD */}

        <div className="flex justify-between">

          <span>
            🔴 Belum Upload
          </span>

          <span className="font-bold text-red-600">

            {data.belum} Gudep

          </span>

        </div>


        {/* PROGRESS */}

        <div className="mt-5">

          <div className="w-full bg-gray-200 rounded-full h-4">

            <div
              className="
                bg-amber-500
                h-4
                rounded-full
                transition-all
                duration-700
              "
              style={{
                width: `${data.progress}%`,
              }}
            />

          </div>


          <p
            className="
              text-center
              mt-2
              font-semibold
              text-amber-700
            "
          >

            Progress Berkas {data.progress}%

          </p>

        </div>


      </div>

    </div>

  );

}