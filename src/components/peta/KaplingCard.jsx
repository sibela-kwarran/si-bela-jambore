export default function KaplingCard({

  nomor,

  gudep,

  jenis,

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

          ?

          jenis === "putra"

            ? "bg-green-300 border-green-600"

            : "bg-pink-300 border-pink-600"


          :

          "bg-gray-100"

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

          {
 gudep.profil_gudep?.nama_pangkalan ||
 "-"
}

        </div>

      )}


    </div>

  );

}