module.exports = (sequelize, DataTypes) =>{
    const EmployerProfile = sequelize.define('EmployerProfile', {
          company: {
             type: DataTypes.STRING,
          },
          address:{
            type: DataTypes.STRING,
          },
          phone: {
            type: DataTypes.STRING,
          },
          website: {
            type: DataTypes.STRING,
          },
          logo: {
            type: DataTypes.STRING,
          },
          coverphoto: {
            type: DataTypes.STRING,
          },
          slogan: {
            type: DataTypes.STRING,
          },
          description: {
            type: DataTypes.TEXT,
          },
          employerId: {
              type: DataTypes.INTEGER,
          }
    })

    EmployerProfile.associate = function(models){
        EmployerProfile.belongsTo(models.Employer)
    }

    return EmployerProfile;
}