import React, {useState} from 'react'
import HTMLFlipBook from 'react-pageflip';
import './book.css';
import { pdfjs, Document, Page as ReactPdfPage } from "react-pdf";
import frogPrincePDF from "./frogprince.pdf";
import Calibration from './Calibration'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const width = 400;
const look_up = 3000;

const Book = () => {
    const bookRef = React.useRef()
    const [toggle, setToggle] = useState(true)

    const leftCutoff = 270;
    const rightCutoff = 1420;

    let lookDirection = null;
    let startLookTime = Number.POSITIVE_INFINITY;


    const webgazer = window.webgazer;

    webgazer.setGazeListener(function(data, elapsedTime) {
        if (data == null) {
            return;
        }
        var xprediction = data.x; //these x coordinates are relative to the viewport
        // element.current = document.elementFromPoint(xprediction, yprediction)
        if(xprediction < leftCutoff){
            startLookTime = elapsedTime;
            lookDirection = 'LEFT'
        } else if(xprediction > rightCutoff){
            startLookTime = elapsedTime;
            lookDirection = 'RIGHT'
        }

        console.log(xprediction)

        if(startLookTime < elapsedTime + look_up && bookRef.current != null) {
            console.log('in here')
            if(lookDirection === 'LEFT'){
                console.log(xprediction)
                console.log("turn right")
                bookRef.current.pageFlip().flipPrev();
            } else {
                console.log(xprediction)
                console.log("turn left")
                bookRef.current.pageFlip().flipNext();
            }
            lookDirection = null;
            startLookTime = Number.POSITIVE_INFINITY
        }

        // console.log(elapsedTime); //elapsed time is based on time since begin was called
    }).begin();

    if(toggle){
        webgazer.showVideoPreview(true).showPredictionPoints(true)
    } else {
        webgazer.showVideoPreview(true).showPredictionPoints(true)
    }


    const Page = React.forwardRef((props, ref) => {
        return (
            <div ref={ref}
                className="page"
                >
                <ReactPdfPage pageNumber={props.number} width={width} />
            </div>
        );
    });

    return (
        <>
        {toggle ? <Calibration /> : 
        <>
            <div className='desk'/>
            <img className='coffee' src="https://cdn.discordapp.com/attachments/708879033194119250/1031079877295734814/coffee-12663.png" />
            <div id="turner" className='leftButton' ></div>
            <div id="turner" className='rightButton' ></div>
            <div id="cover" style={{marginLeft: '30%'}}>
                {/* <WebGazer /> */}
                {/* <div onClick={() => {
                    bookRef.current.pageFlip().flipNext();
                }}>
                    Turn page
                </div> */}
                <Document file={frogPrincePDF}>
                    <HTMLFlipBook width={width} height={525} ref={bookRef}>
                        <Page number={1}>Page text</Page>
                        <Page number={2}>Page text</Page>
                        <Page number={3}>Page text</Page>
                        <Page number={4}>Page text</Page>
                        
                    </HTMLFlipBook>
                </Document>
            </div>
            <div className='cornerbook'></div>
        </>
}

<button className='calibrater' onClick={() => {setToggle(!toggle)}}>Calibrate</button>

        </>

    )
}

export default Book;