const ul = document.querySelector('ul')
const pre = document.querySelector('pre')
const button = document.querySelector('button')
let guitars;

const loadGuitars = async() => {
  const response = await fetch('/api/guitars');
  guitars = await response.json(); 
  renderGuitars(guitars)
  showDetails();
}

const renderGuitars = (guitars) =>{
  const id = window.location.hash.slice(1);
  const html = guitars.map(guitar=>{
    return `
    <li class='${id === guitar.id ? 'selected' : ''}'>
    <a href='#${guitar.id}'>
    ${guitar.brand} ${guitar.name}</a>
    <button data-id='${guitar.id}'>X</button>
    </li>
    `
  }).join('')
  ul.innerHTML=html;
}

loadGuitars();

const showDetails = async() => {
  const id = window.location.hash.slice(1);
  if(id){
  const response = await fetch(`/api/guitars/${id}`);
    if(response.ok){
      const guitar = await response.json();
      pre.innerText=JSON.stringify(guitar,null,2); 
    }
  }
  else {pre.innerHTML = ''}
renderGuitars(guitars)
}
window.addEventListener('hashchange', showDetails)

// random guitar generator
const brands = ['Fender', 'Gibson', 'PRS', 'Gretsch', 'Squier', 'Epiphone', 'Taylor', 'Martin'];
const names = ['One', 'Two', 'Three', 'Four', 'Custom', 'Vintage', 'Standard', 'Special Series', 'Classic'];
const bodies = ['SOLID', 'SEMI-HOLLOW','HOLLOW','ACOUSTIC'];
const pickups = ['SINGLE-COIL', 'DOUBLE-COIL', 'HUMBUCKER','NONE'];
const gauges = [8,9,10,11,12]
const rando = (array) => {return Math.floor(Math.random()*array.length);}
const randomGuitar = () => {
  return {
  name: names[rando(names)],
  brand: brands[rando(brands)],
  bodyType: bodies[rando(bodies)],
  pickUpType: pickups[rando(pickups)],
  stringGauge: gauges[rando(gauges)]
}}
console.log('new guitar!', randomGuitar())

button.addEventListener('click', async()=> {
  const body = randomGuitar();
  console.log('HERE IS THE BODY', body, 'BODY OVER')
  const response = await fetch('/api/guitars', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const guitar = await response.json();
  guitars.push(guitar);
  renderGuitars(guitars);
  window.location.hash = guitar.id;
});

ul.addEventListener('click', async(ev) => {
  if(ev.target.tagName === 'BUTTON'){
    const id = ev.target.getAttribute('data-id');
    await fetch(`api/guitars/${id}`,{
      method: 'DELETE',
    });
    guitars = guitars.filter(guitar => guitar.id !== id);
    renderGuitars(guitars);
  }
  pre.innerHTML = ''
  pre.innerTEXT = ''
})