

function VerifyingLoader() {
    return ( 

        <div className="flex items-center justify-center min-h-screen">
            <div className="flex-col gap-4 w-full flex items-center justify-center">
                <div
                    className="w-20 h-20 border-4 border-transparent text-[#2A3571] text-4xl animate-spin flex items-center justify-center border-t-[#2A3571] rounded-full"
                >
                    <div
                        className="w-16 h-16 border-4 border-transparent text-[#FF9618] text-2xl animate-spin flex items-center justify-center border-t-[#FF9618] rounded-full"
                    ></div>
                </div>
                <div>
                    <span className="mr-2 text-[#2A3571] text-3xl font-bold">Verifying Payment</span>
                    <span className="font-bold text-[#2A3571] text-3xl animate-[ping_1s_0.1s_ease-in-out_infinite]">.</span>
                    <span className="font-bold text-[#2A3571] text-3xl animate-[ping_1s_0.3s_ease-in-out_infinite]">.</span>
                    <span className="font-bold text-[#2A3571] text-3xl animate-[ping_1s_0.5s_ease-in-out_infinite]">.</span>
                </div>
            </div>
        </div>
     );
}

export default VerifyingLoader;