// Test simple para validar scanners sin GraphQL
const { spawn } = require('child_process');

async function testScannerDirect() {
  console.log('🚀 Iniciando prueba directa de scanners...\n');
  
  const testCode = `
    const { EmailSecurityScanner } = require('./src/security/scanners/email-security.scanner');
    const { SSLCertificateScanner } = require('./src/security/scanners/ssl-certificate.scanner');
    
    async function runTests() {
      try {
        console.log('📧 Testing EmailSecurityScanner...');
        const emailScanner = new EmailSecurityScanner();
        const emailResults = await emailScanner.scan('google.com');
        console.log(\`✅ Email scan: \${emailResults.length} findings\`);
        emailResults.forEach((f, i) => console.log(\`  \${i+1}. \${f.title} - \${f.severity}\`));
        
        console.log('\\n🔒 Testing SSLCertificateScanner...');
        const sslScanner = new SSLCertificateScanner();
        const sslResults = await sslScanner.scan('google.com');
        console.log(\`✅ SSL scan: \${sslResults.length} findings\`);
        sslResults.forEach((f, i) => console.log(\`  \${i+1}. \${f.title} - \${f.severity}\`));
        
        console.log('\\n🎉 Tests completados!');
      } catch (error) {
        console.error('❌ Error:', error.message);
      }
    }
    
    runTests();
  `;
  
  const child = spawn('node', ['-e', testCode], { 
    cwd: './apps/api',
    stdio: 'inherit' 
  });
  
  child.on('close', (code) => {
    console.log(`\nProceso terminado con código: ${code}`);
  });
}

testScannerDirect();
