import { memo, useState } from 'react';
import { Button } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import MsgSnackbar from '../MsgSnackbar';

const imageCharsObj = {
  absent: '0x2B1C',
  wrongPlace: '0x1F7E8',
  correct: '0x1F7E9',
  newLine: '\r\n',
};

function convertEvaluationsImageChars(filteredEvaluations) {
  const filteredEvaluationsMod = [...filteredEvaluations];
  const filteredEvaluationsModLen = filteredEvaluationsMod.length;

  // Create initial string before board image chars
  const UTCDate = new Date();
  const initialStr = `Wordle ${UTCDate.toLocaleDateString(
    'en-GB'
  )} ${filteredEvaluationsModLen}/6${imageCharsObj.newLine}${
    imageCharsObj.newLine
  }`;
  const filteredEvaluationsMod2 = filteredEvaluationsMod.map((row, i) => {
    if (i === filteredEvaluationsModLen - 1) {
      return row;
    }
    return [...row, 'newLine'];
  });

  const evaluationsArr = filteredEvaluationsMod2.flat();

  const evaluationsStr = evaluationsArr
    .map((str) =>
      str !== 'newLine'
        ? String.fromCodePoint(imageCharsObj[str])
        : imageCharsObj[str]
    )
    .join('');

  return initialStr + evaluationsStr;
}

function ShareButton({ evaluations }) {
  const filteredEvaluations = evaluations.filter(
    (evaluation) => evaluation !== null
  );
  const shareString = convertEvaluationsImageChars(filteredEvaluations);
  const [infoMsg, setInfoMsg] = useState('');
  const [countInfoMsgs, setCountInfoMsgs] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [countErrorMsgs, setCountErrorMsgs] = useState(0);

  async function copyText() {
    try {
      // check for SSR - navigator is in the browser
      if (navigator) {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(shareString);
        }
      }
      setInfoMsg('Copied results to clipboard');
      setCountInfoMsgs(countInfoMsgs + 1);
    } catch (e) {
      setErrorMsg('There was an error copying your results to the clipboard');
      setCountErrorMsgs(countErrorMsgs + 1);
    }
  }

  return (
    <>
      <MsgSnackbar
        msgType="info"
        msg={infoMsg}
        autoHideDuration={2000}
        countMsgs={countInfoMsgs}
      />
      <MsgSnackbar
        msgType="error"
        msg={errorMsg}
        autoHideDuration={10000}
        countMsgs={countErrorMsgs}
      />
      <Button
        variant="contained"
        color="success"
        onClick={copyText}
        endIcon={<ShareIcon />}
        sx={{ height: '45px' }}
      >
        Share
      </Button>
    </>
  );
}

export default memo(ShareButton);
