module.exports = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px 0',
    display: 'flex',
  },

  content: {
    width: '60%',
    '@media (max-width: 768px)': { width: '80%' },
    '@media (max-width: 600px)': { width: '90%' }
  }
};
