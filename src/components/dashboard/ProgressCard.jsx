export default function ProgressCard() {

    const progress = 35;

    return (

        <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-xl font-semibold mb-5">
                Progress Pendaftaran
            </h2>

            <div className="w-full bg-gray-200 rounded-full h-5">

                <div
                    className="bg-green-600 h-5 rounded-full"
                    style={{
                        width: `${progress}%`,
                    }}
                />

            </div>

            <p className="mt-3 text-gray-600">
                {progress}% Data telah lengkap
            </p>

        </div>

    );
}