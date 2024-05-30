import { useState } from "react";
import PropType from "prop-types"


function ReadMore({id, text, amount = 10}) {
const [expanded, setExpaned] = useState(false)
const splittedText = text.split(' ')
const overflow = splittedText.length > amount
const begin = overflow ? splittedText.slice(0, amount - 1).join(' ') : text
const end = splittedText.slice(amount-1).join(' ')
    return ( <>
    <h3 id={id}>
        {begin}
        {overflow && (<>
        {!expanded && <span>...</span>}
        <span className={`${!expanded && 'hidden'}`}>
            {end}
        </span>

        <span className="text-green-500 ml-2" onClick={()=> setExpaned(!expanded)} role="button">
            {expanded ? 'show less' : 'show more'}
        </span>
        </>)}
    </h3>
    </> );
}


ReadMore.propTypes= {
    id:PropType.number,
    amount:PropType.number,
    text:PropType.string
}
export default ReadMore;