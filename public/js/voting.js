const radioButtons = document.getElementsByClassName('findMe');
const currentVote = document.getElementsByClassName('findMe')[0].name;

async function getDisabled() {
  if (disabledValue === 'true') {
    for (let i = 0; i < radioButtons.length; i++) {
      radioButtons[i].disabled = disabledValue;
      const elProgress = document.getElementById(radioButtons[i].id + 'prog');
      elProgress.style = "background-color: rgba(87, 87, 87, 10%); border-color: rgba(167, 167, 167, 50%); color: rgba(167, 167, 167, 80%);";
      const elAccumulator = document.getElementById(radioButtons[i].id + 'acc');
      elAccumulator.style = "background-color: rgba(167, 167, 167, 50%);";
    };
    const submit = document.getElementById('submitVote');
    submit.remove();
  };
};
getDisabled();

async function getWidth() {
  const widthJSON = JSON.parse(widthData);
  console.log(widthJSON);
  const poppedJSON = widthJSON.pop();
  console.log(poppedJSON);

  widthJSON.forEach(element => {
    // Add the progressbar to the names
    const elProgress = document.getElementById(element.nick + 'acc');
    const candidateVoteCount = element.voting[countSelector].count;
    const calc = candidateVoteCount * 100 / poppedJSON[sum];
    elProgress.style.width = calc + '%';
    // Add numbers next to the progressbar
    const elNumber = document.getElementById(element.nick + 'prog');
    const elVoteCount = '<div>' + candidateVoteCount + '</div>';
    elNumber.insertAdjacentHTML('beforeend', elVoteCount);
  });
};
getWidth();