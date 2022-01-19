const express = require('express')
const res = require('express/lib/response')
const routes = express.Router()

// const basePath = __dirname + "/views"
const views = __dirname + '/views/'

const Profile = {
  data: {
    name: 'Michael',
    avatar: 'https://avatars.githubusercontent.com/u/59966579?v=4',
    'monthly-budget': 3000,
    'days-per-week': 5,
    'hours-per-day': 5,
    'vacation-per-year': 4,
    'value-hour': 75
  },
  controllers: {
    index(req, res) {
      return res.render(views + 'profile', { profile: Profile.data })
    },

    update(req, res ) {
      // req.body para obter os dados
      const data = req.body      
      // definir quantas semanas tem num ano: 52
      const weeksPerYear = 52
      // remover as semanas de ferias do ano, pegar as semanas de 1 mês
      const weeksPerMonth = ((weeksPerYear - data["vacation-per-year"]) / 12)
      //  total de horas trabalhadas na semana
      const weekTotalHours = (data["hours-per-day"] * data["days-per-week"])
      // total de horas trabalhadas no mês
      const monthlyTotalHours = (weekTotalHours * weeksPerMonth)
      // valor da hora 

      const valueHour = (data["monthly-budget"] / monthlyTotalHours)


      Profile.data = {
        ... Profile.data,
        ...req.body,
        "value-hour" : valueHour
      }

      return res.redirect('/profile')
    }
  }
}

const Job = {
  data: [
    {
      id: 1,
      name: 'Pizzaria Guloso',
      "daily-hours": 2,
      "total-hours": 1,
      created_at: Date.now(),
    },
    {
      id: 2,
      name: 'OneTwo Project',
      "daily-hours": 3,
      "total-hours": 47,
      created_at: Date.now(),      
    }
  ],
  controllers: {
    index(req, res) {
      const updateJobs = Job.data.map(job => {
        // ajustes no job
        const remaining = Job.sevices.remainingDays(job)
        const status = remaining <= 0 ? 'done' : 'progress'

        return {
          ...job,
          remaining,
          status,
          budget: Job.sevices.caculateBudget(job, Profile.data["value-hour"])
        }
      })

      return res.render(views + 'index', { jobs: updateJobs })
    },
    create(req, res) {
      return res.render(views + 'job')
    },
    save(req, res) {
      const job = Job.data // object Job access .data
      const lastId = job[job.length - 1]?.id || 0

      job.push({
        id: lastId + 1,
        name: req.body.name,
        'daily-hours': req.body['daily-hours'],
        'total-hours': req.body['total-hours'],
        created_at: Date.now()
      })

      return res.redirect('/')
    },
    show(req, res) {
      
      const jobId = req.params.id

      const job = Job.data.find(job => Number(job.id) === Number(jobId))

      if(!job) {
        return res.send("Job not Found")
      }

      job.budget = Job.sevices.caculateBudget(job, Profile.data["value-hour"])

      return res.render(views +"job-edit", { job })
    },
    update(req, res) {
      const jobId = req.params.id

      const job = Job.data.find(job => Number(job.id) === Number(jobId))

      if(!job) {
        return res.send("Job not Found")
      }

      const updatedJob = {
        ...job,
        name: req.body.name,
        "total-hours": req.body["total-hours"],
        "daily-hours": req.body["daily-hours"],
      }


      Job.data = Job.data.map(job => {
        if(Number(job.id) === Number(jobId)) {
          job = updatedJob
        }

        return job
      })

      res.redirect('/job/'+ jobId)
    }
  },
  sevices: {
    remainingDays(job) {
      // cálculo de tempo restante
      const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed()
    
      const createdDate = new Date(job.created_at)
      const dueDay = createdDate.getDate() + Number(remainingDays)
      const dueDateInMs = createdDate.setDate(dueDay)
    
      const timeDiffInMs = dueDateInMs - Date.now()
      // transformar milli em dias
      const dayInMs = 1000 * 60 * 60 * 24
      const dayDiff = Math.floor(timeDiffInMs / dayInMs)

      //  restam x dias
      return dayDiff
    },
    caculateBudget: (job, valueHour) => valueHour * job['total-hours']
  }
}

//request, response
routes.get('/', Job.controllers.index)

routes.get('/job', Job.controllers.create)

routes.post('/job', Job.controllers.save)

routes.get('/job/:id', Job.controllers.show)

routes.post('/job/:id', Job.controllers.update)

routes.get('/profile', Profile.controllers.index)

routes.post('/profile', Profile.controllers.update)

module.exports = routes
