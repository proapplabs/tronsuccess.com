import React from 'react'
import { Player } from "@lottiefiles/react-lottie-player";
export default function Animate({ file, size = 100 }) {
    let style = {}

    if (file != "tron") {
        style = {
            width: size,
            height: size
        }
    }


    return (<Player className={file} autoplay loop src={"./animate/" + file + ".json"} style={style} />





    )
}