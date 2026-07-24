export default function ActivityCard() {

    const activities = [

        "Data Pembina diperbarui",

        "Regu Garuda ditambahkan",

        "5 Peserta berhasil didaftarkan",

        "Upload Surat Tugas",

        "Pembayaran berhasil dikonfirmasi",

    ];

    return (

        <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-xl font-semibold mb-5">
                Aktivitas Terbaru
            </h2>

            <ul className="space-y-4">

                {activities.map((item, index) => (

                    <li
                        key={index}
                        className="border-b pb-3"
                    >

                        ✅ {item}

                    </li>

                ))}

            </ul>

        </div>

    );
}