import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date()); // Adicionando um campo para verificar se a data do lancamento é anterior a Data Atual
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2)); // verificar se esta disponivel o cancelamento - pegando a data atual e tirando 2 horas para comparando com a data do lancamento
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    // O agendamento recebe um usuario
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    // O agendamento tem um profissional
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
