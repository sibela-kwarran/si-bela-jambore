export default function PreviewKartu({ peserta, onClose }) {
  if (!peserta) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-xl font-bold text-green-700">
            Preview Kartu Peserta
          </h2>

          <button
            onClick={onClose}
            className="text-red-600 text-2xl font-bold"
          >
            ×
          </button>

        </div>

        <div className="relative mx-auto w-[330px]">

          {/* Background ID Card */}

          <img
            src="/template/idcard-peserta.png"
            alt="Template"
            className="w-full rounded-xl"
          />

         

          

          {/* NAMA */}

<div
  className="
    absolute
    left-[215px]
    bottom-[118px]
    w-[120px]
    text-[11px]
    font-semibold
    text-black
  "
>
  {peserta.nama}
</div>

{/* REGU */}

<div
  className="
    absolute
    left-[215px]
    bottom-[87px]
    w-[120px]
    text-[11px]
    font-semibold
    text-black
  "
>
  {peserta.regu}
</div>

{/* NOMOR PESERTA */}

<div
  className="
    absolute
    left-[222px]
    bottom-[39px]
    w-[95px]
    text-[11px]
    font-semibold
    text-black
  "
>
  {peserta.noPeserta}
</div>
        </div>

      </div>

    </div>
  );
}