const ul = document.querySelector('ul')
const pre = document.querySelector('pre')


const setup = async() => {
  // console.log('setup')
  const response = await fetch('/api/guitars');
  const guitars = await response.json(); 
  const html = guitars.map(guitar=>{
    return `
    <li>
    <a href='#${guitar.id}'>
    ${guitar.brand} ${guitar.name}</a>
    </li>
    `
  }).join('')
  console.log(html)
  ul.innerHTML=html;
}
setup()

const showDetails = async() => {
  const id = window.location.hash.slice(1);
  if(id){
  const response = await fetch(`/api/guitars/${id}`);
  if(response.ok){
    const thing = await response.json();
    pre.innerText = guitar.description;
    const link = document.querySelector(`a[href='#${guitar.id}']`)
  }
  console.log(link)
  }
  else {pre.innerText = ''}
}

window.addEventListener('hashchange', showDetails)