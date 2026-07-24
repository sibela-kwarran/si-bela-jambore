export default function KaplingCard({

  nomor,

  gudep,

  onClick,

}) {

  return (

    <div

      onClick={onClick}

      className={`
        h-20
        rounded-lg
        border
        cursor-pointer
        flex
        flex-col
        justify-center
        items-center
        transition
        hover:scale-105
        shadow-sm

        ${
          gudep
            ? "bg-green-300"
            : "bg-gray-100"
        }

      `}

    >

      <div className="text-lg">

        🏕️

      </div>

      <div className="font-bold">

        {nomor}

      </div>

      {gudep && (

        <div

          className="
            text-[10px]
            text-center
            leading-3
            px-1
          "

        >

          {gudep.namaGudep}

        </div>

      )}

    </div>

  );

}