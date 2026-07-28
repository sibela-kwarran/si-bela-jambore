import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";
import { FaMoneyBillWave } from "react-icons/fa";

export default function RingkasanPembayaran() {

  const [data, setData] = useState({
  totalMasuk: 0,
  targetPembayaran: 0,
  sisa: 0,
  sudahBayar: 0,
  belumBayar: 0,
  progress: 0,
});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    const { data: pembayaran, error } = await supabase
      .from("pembayaran")
      .select("*");

    if (error) {
      console.log(error);
      return;
    }

    const totalMasuk = pembayaran.reduce(
  (total, item) => total + Number(item.nominal || 0),
  0
);

const targetPembayaran = pembayaran.reduce(
  (total, item) =>
    total +
    (Number(item.biaya_per_peserta || 0) *
      Number(item.jumlah_peserta || 0)),
  0
);

const sisa = targetPembayaran - totalMasuk;

const sudahBayar = pembayaran.filter(
  (item) => item.status === "Lunas"
).length;

const belumBayar = pembayaran.length - sudahBayar;

const progress =
  targetPembayaran === 0
    ? 0
    : Math.round((totalMasuk / targetPembayaran) * 100);

setData({
  totalMasuk,
  targetPembayaran,
  sisa,
  sudahBayar,
  belumBayar,
  progress,
});
  }

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex items-center gap-3 mb-5">

        <FaMoneyBillWave
          className="text-green-600"
          size={28}
        />

        <h2 className="text-xl font-bold">
          Ringkasan Pembayaran
        </h2>

      </div>

      <div className="space-y-3">

  <div className="flex justify-between">

    <span>✅ Sudah Bayar</span>

    <span className="font-bold text-green-600">
      {data.sudahBayar} Gudep
    </span>

  </div>

  <div className="flex justify-between">

    <span>⏳ Belum Bayar</span>

    <span className="font-bold text-red-600">
      {data.belumBayar} Gudep
    </span>

  </div>

  <hr />

  <div className="flex justify-between">

    <span>🎯 Target Pembayaran</span>

    <span className="font-bold">

      Rp {data.targetPembayaran.toLocaleString("id-ID")}

    </span>

  </div>

  <div className="flex justify-between">

    <span>💰 Dana Masuk</span>

    <span className="font-bold text-green-700">

      Rp {data.totalMasuk.toLocaleString("id-ID")}

    </span>

  </div>

  <div className="flex justify-between">

    <span>❌ Sisa Pembayaran</span>

    <span className="font-bold text-red-600">

      Rp {data.sisa.toLocaleString("id-ID")}

    </span>

  </div>

  <div className="mt-5">

    <div className="w-full bg-gray-200 rounded-full h-4">

      <div
        className="bg-green-600 h-4 rounded-full transition-all duration-700"
        style={{
          width: `${data.progress}%`,
        }}
      />

    </div>

    <p className="text-center mt-3 font-semibold text-green-700">

      Progress Pembayaran {data.progress}%

    </p>

  </div>

</div>

        <div className="mt-5">

          <div className="w-full bg-gray-200 rounded-full h-4">

            <div
              className="bg-green-600 h-4 rounded-full"
              style={{
                width: `${data.progress}%`,
              }}
            ></div>

          </div>

          <p className="text-center mt-2 text-sm text-gray-500">

            Progress Pembayaran {data.progress}%

          </p>

        </div>

      </div>

    

  );

}