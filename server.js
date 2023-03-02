// sequelize
const Sequelize = require('sequelize')
const conn = new Sequelize(process.env.DATABASE_URL || "postgres://localhost/guitar_api_db")
const { UUIDV4 } = require('sequelize')

const Guitar = conn.define('guitar' ,{
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING
  },
  brand:{
    type: Sequelize.STRING
  },
  bodyType:{
    type: Sequelize.ENUM('SOLID', 'SEMI-HOLLOW','HOLLOW','ACOUSTIC'),
    defaultValue: 'SOLID',
  },
  pickUpType:{
    type: Sequelize.ENUM('SINGLE-COIL', 'DOUBLE-COIL','HUMBUCKER', 'NONE'),
  },
  stringGauge:{
    type: Sequelize.INTEGER
  },
  description: {
    type: Sequelize.TEXT
  },
  isElectric:{
    type: Sequelize.VIRTUAL,
    get(){
      return this.pickUpType === 'NONE' ? false : true
    },
  },
  isAcoustic:{
    type: Sequelize.VIRTUAL,
    get(){
      return this.bodyType === 'ACOUSTIC' ? true : false
    },
  },
}
);

// express
const express = require('express');
const app = express()
const path = require('path')


// middleware
app.use('/assets', express.static('assets'))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))

// routes
app.get('/api/guitars', async(req, res, next) => {
  try{
    res.send(await Guitar.findAll({
      attributes: {
        exclude: ['bodyType', 'pickUpType', 'stringGauge', 'description']
      }})
      )
      
  }
  catch(ex){
    next(ex)
  }
}
)
app.get('/api/guitars/:id', async(req, res, next) => {
  try{
    const guitar = await Guitar.findByPk(req.params.id)
    if(!guitar){
      res.sendStatus(404)
    }
    else{
    res.send(guitar)}
  }
  catch(ex){
    next(ex)
  }});

app.post('/api/guitars', async(req, res, next)=> {
    try {
      const guitars = await Guitar.create(req.body);
      res.status(201).send(guitars);
    }
    catch(ex){
      next(ex);
    }
  });

  app.delete('/api/guitars/:id', async(req, res, next) => {
    try{
      const toDelete = await Guitar.findByPk(req.params.id)
      toDelete.destroy();
      res.sendStatus(204)
    }
    catch(ex){
      next(ex)
    }
  })

  
app.use((err, req, res, next)=> {
  console.log(err);
  res.status(500).send({ error: err });
});


// server page setup


const port = process.env.PORT || 3000;

app.listen(port, async()=> {
  try{
    console.log(`listening on port ${port}`);
    await conn.sync({ force: true });
    const [strat, tele, sg, lesPaul, vintageGr, martinD15, martinD18, taylor, prsSemi] = await Promise.all([
      Guitar.create({ name: 'Stratocaster', brand: 'Fender', bodyType: 'SOLID', pickUpType: 'SINGLE-COIL', stringGauge: 10  }),
      Guitar.create({ name: 'Telecaster', brand: 'Fender', bodyType: 'SOLID', pickUpType: 'SINGLE-COIL', stringGauge: 9  }),
      Guitar.create({ name: 'SG', brand: 'Gibson', bodyType: 'SOLID', pickUpType: 'HUMBUCKER', stringGauge: 10  }),
      Guitar.create({ name: 'Les Paul', brand: 'Gibson', bodyType: 'SOLID', pickUpType: 'HUMBUCKER', stringGauge: 9  }),
      Guitar.create({ name: '1959 Vintage', brand: 'Gretsch', bodyType: 'HOLLOW', pickUpType: 'HUMBUCKER', stringGauge: 11  }),
      Guitar.create({ name: 'D15', brand: 'Martin', bodyType: 'ACOUSTIC', pickUpType: 'NONE', stringGauge: 11  }),
      Guitar.create({ name: 'D18', brand: 'Martin', bodyType: 'ACOUSTIC', pickUpType: 'NONE', stringGauge: 10  }),
      Guitar.create({ name: 'V-Class', brand: 'Taylor', bodyType: 'ACOUSTIC', pickUpType: 'HUMBUCKER', stringGauge: 11  }),
      Guitar.create({ name: 'Special Semi-Hollow Charcoal', brand: 'PRS', bodyType: 'SEMI-HOLLOW', pickUpType: 'HUMBUCKER', stringGauge: 10  }),
    ]);
    console.log('ready!!') 
}
  catch(ex){
    console.log(ex)
  }
});
