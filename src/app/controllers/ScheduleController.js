import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a Provider' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    // 2020-03-18T00:00:00
    // 2020-03-18T23:59:59

    // Vou pegar a primeira hora do dia e a ultima hora do dia e pegar todos os agendamentos do dia

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });

    return res.json({ appointments });
  }
}
export default new ScheduleController();
