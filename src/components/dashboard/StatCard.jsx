export default function StatCard({
    title,
    value,
    color,
    icon,
}) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-8"
             style={{ borderColor: color }}>

            <div className="flex justify-between items-center">

                <div>

                    <p className="text-gray-500 text-sm">
                        {title}
                    </p>

                    <h2 className="text-4xl font-bold mt-3">
                        {value}
                    </h2>

                </div>

                <div
                    className="text-5xl"
                    style={{ color }}
                >
                    {icon}
                </div>

            </div>

        </div>
    );
}