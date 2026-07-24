import {
    FaUserGraduate,
    FaFolderOpen,
    FaMoneyBillWave,
    FaIdCard,
} from "react-icons/fa";

export default function QuickAction() {

    const menus = [

        {
            title: "Tambah Peserta",
            icon: <FaUserGraduate />,
            color: "bg-blue-500",
        },

        {
            title: "Upload Berkas",
            icon: <FaFolderOpen />,
            color: "bg-green-500",
        },

        {
            title: "Pembayaran",
            icon: <FaMoneyBillWave />,
            color: "bg-yellow-500",
        },

        {
            title: "Cetak Kartu",
            icon: <FaIdCard />,
            color: "bg-purple-500",
        },

    ];

    return (

        <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-xl font-semibold mb-6">
                Menu Cepat
            </h2>

            <div className="grid grid-cols-2 gap-4">

                {menus.map((menu) => (

                    <button
                        key={menu.title}
                        className={`${menu.color} text-white rounded-xl p-5 hover:scale-105 transition`}
                    >

                        <div className="text-3xl mb-2">

                            {menu.icon}

                        </div>

                        {menu.title}

                    </button>

                ))}

            </div>

        </div>

    );
}