import { Router } from 'express'

function sleep(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({})
    }, time || 0)
  })
}

const delay = 350

const router = Router()

router.route('/200').all(async (req, res) => {
  await sleep(delay)
  return res.status(200).json({})
})
router.route('/200/search').all(async (req, res) => {
  await sleep(delay)
  return res.status(200).json([])
})

router.route('/401').all(async (req, res) => {
  await sleep(delay)
  return res.status(401).send()
})
router.route('/401/search').all(async (req, res) => {
  await sleep(delay)
  return res.status(401).send()
})

router.route('/403').all(async (req, res) => {
  await sleep(delay)
  return res.status(403).send()
})
router.route('/403/search').all(async (req, res) => {
  await sleep(delay)
  return res.status(403).send()
})

router.route('/404').all(async (req, res) => {
  await sleep(delay)
  return res.status(404).send()
})
router.route('/404/search').all(async (req, res) => {
  await sleep(delay)
  return res.status(404).send()
})

router.route('/405').all(async (req, res) => {
  await sleep(delay)
  return res.status(405).send()
})
router.route('/405/search').all(async (req, res) => {
  await sleep(delay)
  return res.status(405).send()
})

export const echoRouter = router
