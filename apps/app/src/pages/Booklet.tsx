import { useState } from "react";
import { MoveLeft, MoveRight } from "lucide-react";

import Button from "../components/common/Button";

export default function Booklet({}){

    // go through list of sample posters
    const samplePosters = [ "/sample_posters/poster_1.png", "/sample_posters/poster_2.png", "/sample_posters/poster_3.png", "/sample_posters/poster_4.png", "/sample_posters/poster_5.png" ];

    // to keep track of which poster is showing, page = 0 initially
    const [currentPoster, setPoster] = useState(0);

    // go back one poster 
    function flipPrevPoster() {
        const prevPoster = currentPoster - 1;
        const actualPoster = Math.max(0, prevPoster); // dont go less than the first poster
        setPoster(actualPoster);
    }

    // go to next poster
    function flipNextPoster() {
        const lastPoster = samplePosters.length - 1;
        const nextPoster = Math.min(currentPoster + 1, lastPoster); // dont go beyond last poster
        setPoster(nextPoster);
    }

    return (
    <div className="p-4">
        <p className="text-lg font-medium text-gray-700 text-center">{currentPoster + 1} / {samplePosters.length}</p>
        {/* poster area */}
        <div className="mt-4 border rounded-lg bg-white shadow w-full max-w-md mx-auto p-10  flex items-center justify-center aspect-3/4">
        <img src={samplePosters[currentPoster]} alt={`Poster ${currentPoster + 1}`} className="w-full h-full object-cover rounded" />
        </div>
        {/* next and prev buttons */}
        <div className="flex justify-center gap-6 mt-4">
        <Button onClick = {flipPrevPoster} type="button" icon={MoveLeft} className="shrink-0 bg-(--accent) px-4 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-(--surface) hover:text-(--accent) border border-(--accent) cursor-pointer whitespace-nowrap">
            Prev
        </Button>
        <Button onClick={flipNextPoster} type="button" icon={MoveRight} className="shrink-0 bg-(--accent) px-4 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-(--surface) hover:text-(--accent) border border-(--accent) cursor-pointer whitespace-nowrap">
            Next
        </Button>
        </div>
    </div>
    );
}
