import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import supabase from "../../lib/supabase";

export default function DataGudep() {

  const navigate = useNavigate();

  // ======================================================
  // STATE
  // ======================================================

  const [dataGudep, setDataGudep] = useState([]);

  const [loading, setLoading] = useState(true);

  const [savingId, setSavingId] = useState(null);


  // ======================================================
  // LOAD DATA
  // ======================================================

  useEffect(() => {

    loadDataGudep();

  }, []);


  async function loadDataGudep() {

    try {

      setLoading(true);

      // ==================================================
      // AMBIL SELURUH PROFIL GUDEP
      // ==================================================

      const {
        data: profil,
        error: profilError
      } = await supabase
        .from("profil_gudep")
        .select(`
          id,
          nama_pangkalan,
          gudep_putra,
          gudep_putri,
          jenjang
        `)
        .order("nama_pangkalan", {
          ascending: true
        });


      if (profilError) {

        throw profilError;

      }


      // ==================================================
      // JIKA BELUM ADA GUDEP
      // ==================================================

      if (!profil || profil.length === 0) {

        setDataGudep([]);

        return;

      }


      // ==================================================
      // AMBIL DATA MASING-MASING GUDEP
      // ==================================================

      const hasil = await Promise.all(

        profil.map(async (item) => {


          // ==============================================
          // PESERTA
          // ==============================================

          const {
            data: peserta,
            error: pesertaError
          } = await supabase
            .from("peserta")
            .select("jk")
            .eq("gudep_id", item.id);


          if (pesertaError) {

            console.error(
              "ERROR PESERTA GUDEP:",
              item.id,
              pesertaError
            );

          }


          const pesertaData = peserta || [];


          const pesertaPutra =
            pesertaData.filter(
              (p) =>
                String(p.jk || "")
                  .trim()
                  .toLowerCase() === "putra"
            ).length;


          const pesertaPutri =
            pesertaData.filter(
              (p) =>
                String(p.jk || "")
                  .trim()
                  .toLowerCase() === "putri"
            ).length;


          // ==============================================
          // REGU
          // ==============================================

          const {
            data: regu,
            error: reguError
          } = await supabase
            .from("data_regu")
            .select("jenis")
            .eq("gudep_id", item.id);


          if (reguError) {

            console.error(
              "ERROR REGU GUDEP:",
              item.id,
              reguError
            );

          }


          const reguData = regu || [];


          const reguPutra =
            reguData.filter(
              (r) =>
                String(r.jenis || "")
                  .trim()
                  .toLowerCase() === "putra"
            ).length;


          const reguPutri =
            reguData.filter(
              (r) =>
                String(r.jenis || "")
                  .trim()
                  .toLowerCase() === "putri"
            ).length;


          // ==============================================
          // RETURN
          // ==============================================

          return {

            ...item,

            pesertaPutra,

            pesertaPutri,

            totalPeserta:
              pesertaPutra +
              pesertaPutri,

            reguPutra,

            reguPutri,

            totalRegu:
              reguPutra +
              reguPutri,

          };

        })

      );


      setDataGudep(hasil);


    } catch (error) {

      console.error(
        "GAGAL LOAD DATA GUDEP:",
        error
      );

      alert(
        "Gagal mengambil data pangkalan dari Supabase.\n\n" +
        error.message
      );

      setDataGudep([]);

    } finally {

      setLoading(false);

    }

  }


  // ======================================================
  // UBAH JENJANG
  // ======================================================

  async function handleJenjangChange(id, jenjang) {

    try {

      setSavingId(id);


      const {
        error
      } = await supabase
        .from("profil_gudep")
        .update({
          jenjang: jenjang || null
        })
        .eq("id", id);


      if (error) {

        throw error;

      }


      // ================================================
      // UPDATE DATA DI TAMPILAN
      // ================================================

      setDataGudep((prev) =>

        prev.map((item) =>

          item.id === id
            ? {
                ...item,
                jenjang: jenjang || null
              }
            : item

        )

      );


    } catch (error) {

      console.error(
        "GAGAL SIMPAN JENJANG:",
        error
      );

      alert(
        "Gagal menyimpan jenjang.\n\n" +
        error.message
      );

    } finally {

      setSavingId(null);

    }

  }


  // ======================================================
  // STATISTIK
  // ======================================================

  const jumlahSD =
    dataGudep.filter(
      (item) => item.jenjang === "SD"
    ).length;


  const jumlahSMP =
    dataGudep.filter(
      (item) => item.jenjang === "SMP"
    ).length;


  const belumDitentukan =
    dataGudep.filter(
      (item) =>
        !item.jenjang
    ).length;


  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {

    return (

      <div className="flex items-center justify-center py-20">

        <div className="text-center">

          <div className="
            w-12
            h-12
            border-4
            border-green-200
            border-t-green-700
            rounded-full
            animate-spin
            mx-auto
            mb-4
          " />

          <p className="
            text-gray-500
            font-medium
          ">

            Memuat seluruh data pangkalan...

          </p>

        </div>

      </div>

    );

  }


  // ======================================================
  // TAMPILAN
  // ======================================================

  return (

    <div className="space-y-6">


      {/* ==================================================
          HEADER
      ================================================== */}

      <div>

        <h1 className="
          text-2xl
          sm:text-3xl
          font-bold
          text-amber-700
        ">

          🏫 Data Gudep

        </h1>

        <p className="
          text-gray-500
          text-sm
          sm:text-base
          mt-1
        ">

          Kelola seluruh pangkalan peserta Jambore Ranting 2026.

        </p>

      </div>



      {/* ==================================================
          RINGKASAN
      ================================================== */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-3
        gap-4
      ">


        {/* TOTAL */}

        <div className="
          bg-white
          rounded-2xl
          shadow
          p-5
          border-l-4
          border-blue-600
        ">

          <p className="
            text-sm
            text-gray-500
          ">

            Total Pangkalan

          </p>

          <p className="
            text-3xl
            font-extrabold
            text-blue-700
            mt-1
          ">

            {dataGudep.length}

          </p>

        </div>



        {/* SD */}

        <div className="
          bg-white
          rounded-2xl
          shadow
          p-5
          border-l-4
          border-green-600
        ">

          <p className="
            text-sm
            text-gray-500
          ">

            Pangkalan SD / SDIT / MI

          </p>

          <p className="
            text-3xl
            font-extrabold
            text-green-700
            mt-1
          ">

            {jumlahSD}

          </p>

        </div>



        {/* SMP */}

        <div className="
          bg-white
          rounded-2xl
          shadow
          p-5
          border-l-4
          border-purple-600
        ">

          <p className="
            text-sm
            text-gray-500
          ">

            Pangkalan SMP / SMPIT / MTs

          </p>

          <p className="
            text-3xl
            font-extrabold
            text-purple-700
            mt-1
          ">

            {jumlahSMP}

          </p>

        </div>

      </div>



      {/* ==================================================
          PERINGATAN JENJANG
      ================================================== */}

      {belumDitentukan > 0 && (

        <div className="
          bg-yellow-50
          border
          border-yellow-300
          rounded-xl
          p-4
          flex
          items-start
          gap-3
        ">

          <div className="text-2xl">
            ⚠️
          </div>

          <div>

            <p className="
              font-bold
              text-yellow-800
            ">

              Masih ada {belumDitentukan} pangkalan
              yang belum ditentukan jenjangnya.

            </p>

            <p className="
              text-sm
              text-yellow-700
              mt-1
            ">

              Silakan pilih SD atau SMP pada kolom
              Jenjang masing-masing pangkalan.

            </p>

          </div>

        </div>

      )}



      {/* ==================================================
          TABEL
      ================================================== */}

      <div className="
        bg-white
        rounded-xl
        shadow
        p-4
        sm:p-6
      ">


        {/* JUDUL */}

        <div className="mb-5">

          <h2 className="
            text-lg
            sm:text-xl
            font-bold
            text-amber-700
          ">

            📋 Daftar Seluruh Pangkalan

          </h2>

          <p className="
            text-xs
            sm:text-sm
            text-gray-500
            mt-1
          ">

            Total {dataGudep.length} pangkalan terdaftar di Supabase.

          </p>

        </div>



        {/* TABLE WRAPPER */}

        <div className="
          w-full
          overflow-x-auto
          rounded-xl
          border
        ">


          <table className="
            min-w-[1200px]
            w-full
            border-collapse
            text-sm
          ">


            {/* ==================================================
                HEADER
            ================================================== */}

            <thead className="
              bg-amber-700
              text-white
            ">

              <tr>

                <th className="
                  border
                  border-amber-600
                  p-3
                  text-center
                ">

                  No

                </th>


                <th className="
                  border
                  border-amber-600
                  p-3
                  text-left
                ">

                  Nama Pangkalan

                </th>


                <th className="
                  border
                  border-amber-600
                  p-3
                  text-center
                ">

                  Gudep Putra

                </th>


                <th className="
                  border
                  border-amber-600
                  p-3
                  text-center
                ">

                  Gudep Putri

                </th>


                <th className="
                  border
                  border-amber-600
                  p-3
                  text-center
                ">

                  Jenjang

                </th>


                <th className="
                  border
                  border-amber-600
                  p-3
                  text-center
                ">

                  Regu Putra

                </th>


                <th className="
                  border
                  border-amber-600
                  p-3
                  text-center
                ">

                  Regu Putri

                </th>


                <th className="
                  border
                  border-amber-600
                  p-3
                  text-center
                ">

                  Peserta Putra

                </th>


                <th className="
                  border
                  border-amber-600
                  p-3
                  text-center
                ">

                  Peserta Putri

                </th>


                <th className="
                  border
                  border-amber-600
                  p-3
                  text-center
                ">

                  Aksi

                </th>

              </tr>

            </thead>



            {/* ==================================================
                BODY
            ================================================== */}

            <tbody>


              {dataGudep.length === 0 ? (

                <tr>

                  <td
                    colSpan="10"
                    className="
                      p-10
                      text-center
                      text-gray-500
                    "
                  >

                    Belum ada data pangkalan.

                  </td>

                </tr>

              ) : (

                dataGudep.map((item, index) => (

                  <tr
                    key={item.id}
                    className="
                      border-b
                      hover:bg-gray-50
                    "
                  >


                    {/* NO */}

                    <td className="
                      border
                      p-3
                      text-center
                      font-medium
                    ">

                      {index + 1}

                    </td>



                    {/* NAMA */}

                    <td className="
                      border
                      p-3
                      font-semibold
                      text-gray-800
                    ">

                      {item.nama_pangkalan || "-"}

                    </td>



                    {/* GUDEP PUTRA */}

                    <td className="
                      border
                      p-3
                      text-center
                      font-medium
                    ">

                      {item.gudep_putra || "-"}

                    </td>



                    {/* GUDEP PUTRI */}

                    <td className="
                      border
                      p-3
                      text-center
                      font-medium
                    ">

                      {item.gudep_putri || "-"}

                    </td>



                    {/* JENJANG */}

                    <td className="
                      border
                      p-3
                      text-center
                    ">

                      <select
                        value={
                          item.jenjang || ""
                        }
                        disabled={
                          savingId === item.id
                        }
                        onChange={(e) =>
                          handleJenjangChange(
                            item.id,
                            e.target.value
                          )
                        }
                        className={`
                          rounded-lg
                          border
                          px-3
                          py-2
                          font-semibold
                          outline-none
                          focus:ring-2
                          focus:ring-amber-200
                          ${
                            item.jenjang === "SD"
                              ? "border-green-400 bg-green-50 text-green-700"
                              : item.jenjang === "SMP"
                              ? "border-purple-400 bg-purple-50 text-purple-700"
                              : "border-yellow-400 bg-yellow-50 text-yellow-700"
                          }
                        `}
                      >

                        <option value="">
                          Belum Ditentukan
                        </option>

                        <option value="SD">
                          SD / SDIT / MI
                        </option>

                        <option value="SMP">
                          SMP / SMPIT / MTs
                        </option>

                      </select>

                      {savingId === item.id && (

                        <div className="
                          text-xs
                          text-gray-400
                          mt-1
                        ">

                          Menyimpan...

                        </div>

                      )}

                    </td>



                    {/* REGU PUTRA */}

                    <td className="
                      border
                      p-3
                      text-center
                    ">

                      <span className="
                        inline-flex
                        items-center
                        justify-center
                        min-w-[40px]
                        px-2
                        py-1
                        rounded-full
                        bg-green-100
                        text-green-700
                        font-bold
                      ">

                        {item.reguPutra}

                      </span>

                    </td>



                    {/* REGU PUTRI */}

                    <td className="
                      border
                      p-3
                      text-center
                    ">

                      <span className="
                        inline-flex
                        items-center
                        justify-center
                        min-w-[40px]
                        px-2
                        py-1
                        rounded-full
                        bg-pink-100
                        text-pink-700
                        font-bold
                      ">

                        {item.reguPutri}

                      </span>

                    </td>



                    {/* PESERTA PUTRA */}

                    <td className="
                      border
                      p-3
                      text-center
                      font-bold
                    ">

                      {item.pesertaPutra}

                    </td>



                    {/* PESERTA PUTRI */}

                    <td className="
                      border
                      p-3
                      text-center
                      font-bold
                    ">

                      {item.pesertaPutri}

                    </td>



                    {/* AKSI */}

                    <td className="
                      border
                      p-3
                      text-center
                    ">

                      <button
                        onClick={() =>
                          navigate(
                            `/admin/detail-gudep/${item.id}`
                          )
                        }
                        className="
                          inline-flex
                          items-center
                          gap-1
                          bg-blue-600
                          hover:bg-blue-700
                          text-white
                          px-4
                          py-2
                          rounded-lg
                          font-semibold
                          transition
                        "
                      >

                        👁️ Lihat

                      </button>

                    </td>


                  </tr>

                ))

              )}

            </tbody>


          </table>


        </div>



        {/* PETUNJUK HP */}

        {dataGudep.length > 0 && (

          <div className="
            mt-3
            text-xs
            text-gray-400
            sm:hidden
            text-center
          ">

            ← Geser tabel ke kiri/kanan untuk melihat data →

          </div>

        )}

      </div>


    </div>

  );

}