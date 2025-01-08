

function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex-col gap-4 w-full flex items-center justify-center">
                <div
                    className="w-10 h-10 border-2 border-transparent text-[#2A3571] text-4xl animate-spin flex items-center justify-center border-t-[#2A3571] rounded-full"
                >
                    <div
                        className="w-8 h-8 border-2 border-transparent text-[#FF9618] text-2xl animate-spin flex items-center justify-center border-t-[#FF9618] rounded-full"
                    ></div>
                </div>
            </div>
        </div>
    );
}

export default Loading;
