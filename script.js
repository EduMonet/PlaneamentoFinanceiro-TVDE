/**
 * VDC - Planeador Financeiro TVDE
 * Correção de Exportação PDF (Evitar Página em Branco)
 */

async function gerarPdfEvidencia() {
    const resHTML = document.getElementById('resultado').innerHTML;
    const canvas = document.getElementById('graficoCustos');
    
    // 1. Validar se o gráfico existe para evitar PDF vazio
    if (!canvas || canvas.style.display === 'none') {
        alert("Por favor, execute o cálculo primeiro.");
        return;
    }

    const imgData = canvas.toDataURL('image/png', 1.0);
    const dataH = new Date().toLocaleString('pt-PT');

    // 2. Criar o template do PDF com largura fixa (170mm) e margens forçadas
    const htmlRelatorio = `
        <div style="width: 170mm; min-height: 250mm; margin: 0 auto; padding: 15mm; border: 2mm solid #000080; box-sizing: border-box; font-family: Arial, sans-serif; background: #fff;">
            <div style="text-align: center; border-bottom: 2px solid #000080; padding-bottom: 15px; margin-bottom: 20px;">
                <h1 style="color: #000080; margin: 0; font-size: 22px; text-transform: uppercase;">Planeamento Financeiro Estratégico</h1>
                <p style="font-weight: bold; margin: 5px 0;">Voz do Condutor — Unidade de Auditoria VDC</p>
                <p style="font-size: 11px;">Unidade de Inteligência TVDE</p>
            </div>
            
            <p style="font-size: 12px;"><strong>Data de Emissão:</strong> ${dataH}</p>
            
            <div style="font-size: 15px; line-height: 1.8; margin: 30px 0; color: #333; padding: 15px; background: #f9f9f9; border-radius: 5px;">
                ${resHTML}
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <p style="font-size: 12px; font-weight: bold; color: #000080; margin-bottom: 10px;">Composição do Volume de Faturação Mensal</p>
                <img src="${imgData}" style="width: 110mm; height: auto; border: 1px solid #eee;">
            </div>

            <div style="margin-top: 40px; font-size: 10px; color: #666; background: #f4f4f4; padding: 15px; border-radius: 4px; line-height: 1.5;">
                <strong>NOTA DE CONFORMIDADE:</strong> Este relatório é um documento técnico de planeamento. 
                Os valores apresentados incluem margens de segurança para garantir a resiliência financeira 
                da operação TVDE perante variações de custos e procura.
            </div>
        </div>
    `;

    // 3. Configurações de Renderização (Otimizado para evitar branco)
    const opt = {
        margin: [5, 5, 5, 5],
        filename: 'VDC_Planeamento_Financeiro.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true, 
            letterRendering: true,
            scrollY: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // 4. Execução com promessa para garantir o processamento
    try {
        await html2pdf().from(htmlRelatorio).set(opt).save();
        console.log("Relatório VDC gerado com sucesso.");
    } catch (error) {
        console.error("Erro na geração do PDF:", error);
        alert("Erro ao gerar PDF. Verifique se o navegador permite pop-ups/downloads.");
    }
}
