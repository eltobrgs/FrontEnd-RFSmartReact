//para produçao 
// export const API_BASE_URL = 'https://backend-rfsmart.onrender.com/api'; 

//para teste
export const API_BASE_URL = 'http://localhost:3000/api';

// Verificar se a API está acessível (quando em ambiente de desenvolvimento)
if (import.meta.env.DEV) {
  fetch(`${API_BASE_URL}/health-check`)
    .then(response => {
      if (!response.ok) {
        console.error('🔴 A API não está respondendo corretamente. Verifique se o servidor backend está rodando.');
        // Mostrar mensagem visível no console
        console.log('%c⚠️ BACKEND NÃO ESTÁ RODANDO ⚠️', 'background: #ff0000; color: white; font-size: 24px; padding: 10px;');
        console.log('%cVerifique se o servidor backend está rodando na porta 3000', 'font-size: 16px; color: orange;');
      } else {
        console.log('🟢 API conectada e funcionando.');
      }
    })
    .catch(error => {
      console.error('🔴 Não foi possível se conectar à API:', error);
      // Mostrar mensagem visível no console
      console.log('%c⚠️ BACKEND NÃO ESTÁ RODANDO ⚠️', 'background: #ff0000; color: white; font-size: 24px; padding: 10px;');
      console.log('%cVerifique se o servidor backend está rodando na porta 3000', 'font-size: 16px; color: orange;');
    });
}

