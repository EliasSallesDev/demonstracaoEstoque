// Sistema de Gerenciamento de Estoque com FIFO em JavaScript (Versão Simplificada)

// Classe Produto
class Produto {
    constructor(nome, codigo, quantidade, dataVencimento) {
      this.nome = nome;
      this.codigo = codigo;
      this.quantidade = quantidade;
      this.dataVencimento = new Date(dataVencimento);
    }
  
    getDiasAteVencimento() {
      const hoje = new Date();
      const diferenca = this.dataVencimento.getTime() - hoje.getTime();
      return Math.ceil(diferenca / (1000 * 3600 * 24));
    }
  
    toString() {
      return `Produto: ${this.nome} | Código: ${this.codigo} | Quantidade: ${this.quantidade} | ` +
             `Vencimento: ${this.dataVencimento.toLocaleDateString('pt-BR')} | ` +
             `Dias até vencer: ${this.getDiasAteVencimento()}`;
    }
  }
  
  // Classe EstoqueFIFO
  class EstoqueFIFO {
    constructor() {
      this.produtos = [];
    }
  
    // Adicionar um produto respeitando a ordem FIFO por data de vencimento
    adicionarProduto(produto) {
      this.produtos.push(produto);
      // Ordena a lista pelo critério FIFO (data de vencimento mais próxima primeiro)
      this.produtos.sort((a, b) => a.dataVencimento - b.dataVencimento);
      console.log(`Produto adicionado: ${produto.nome}`);
    }
  
    // Listar todos os produtos ordenados por data de vencimento
    listarProdutos() {
      if (this.produtos.length === 0) {
        console.log("O estoque está vazio.");
        return;
      }
  
      console.log("\n=== Lista de Produtos (ordenados por data de vencimento) ===");
      this.produtos.forEach((produto, index) => {
        console.log(`${index + 1}. ${produto.toString()}`);
      });
    }
  
    // Remover um produto pela posição na lista
    removerProduto(indice) {
      if (indice >= 0 && indice < this.produtos.length) {
        const removido = this.produtos.splice(indice, 1)[0];
        console.log(`Produto removido: ${removido.nome}`);
      } else {
        console.log("Índice inválido.");
      }
    }
  
    // Remover produtos vencidos
    removerVencidos() {
      const hoje = new Date();
      const vencidos = this.produtos.filter(
        produto => produto.dataVencimento <= hoje
      );
  
      if (vencidos.length === 0) {
        console.log("Não há produtos vencidos no estoque.");
      } else {
        this.produtos = this.produtos.filter(
          produto => produto.dataVencimento > hoje
        );
        console.log(`Produtos vencidos removidos: ${vencidos.length}`);
        vencidos.forEach(produto => {
          console.log(`- ${produto.nome} (Código: ${produto.codigo})`);
        });
      }
    }
  
    // Vender um produto (reduzir quantidade ou remover)
    venderProduto(codigo, quantidade) {
      const index = this.produtos.findIndex(produto => produto.codigo === codigo);
      
      if (index !== -1) {
        const produto = this.produtos[index];
        
        if (produto.quantidade <= quantidade) {
          // Remove o produto se a quantidade for igual ou menor
          console.log(`Produto vendido (estoque esgotado): ${produto.nome}`);
          this.produtos.splice(index, 1);
        } else {
          // Reduz a quantidade
          produto.quantidade -= quantidade;
          console.log(`Produto vendido: ${produto.nome} | Quantidade: ${quantidade} | Estoque restante: ${produto.quantidade}`);
        }
      } else {
        console.log(`Produto não encontrado com o código: ${codigo}`);
      }
    }
  
    // Verificar produtos próximos ao vencimento (7 dias)
    verificarProdutosProximosVencimento() {
      const hoje = new Date();
      const seteDiasDepois = new Date(hoje);
      seteDiasDepois.setDate(hoje.getDate() + 7);
  
      const proximosVencimento = this.produtos.filter(
        produto => produto.dataVencimento > hoje && produto.dataVencimento <= seteDiasDepois
      );
  
      if (proximosVencimento.length === 0) {
        console.log("Não há produtos próximos ao vencimento (7 dias).");
      } else {
        console.log("\n=== Produtos próximos ao vencimento (7 dias) ===");
        proximosVencimento.forEach(produto => {
          console.log(`- ${produto.nome} | Código: ${produto.codigo} | Vence em: ${produto.getDiasAteVencimento()} dias`);
        });
      }
    }
  
    // Gerar relatório de produtos vencidos
    gerarRelatorioVencidos() {
      const hoje = new Date();
      const vencidos = this.produtos.filter(
        produto => produto.dataVencimento <= hoje
      );
  
      console.log("\n=== Relatório de Produtos Vencidos ===");
      if (vencidos.length === 0) {
        console.log("Não há produtos vencidos no estoque.");
      } else {
        vencidos.forEach(produto => {
          console.log(`- ${produto.nome} | Código: ${produto.codigo} | Vencido há: ${Math.abs(produto.getDiasAteVencimento())} dias`);
        });
      }
    }
  }
  
  // Demonstração do sistema com dados pré-definidos
  function demonstracaoSistema() {
    console.log("=== Demonstração do Sistema de Gerenciamento de Estoque com FIFO ===\n");
    
    // Criar instância do estoque
    const estoque = new EstoqueFIFO();
    
    // Adicionar produtos
    console.log("1. Adicionando produtos ao estoque:");
    estoque.adicionarProduto(new Produto("Leite", "L001", 50, "2025-04-15"));
    estoque.adicionarProduto(new Produto("Pão", "P001", 30, "2025-03-25"));
    estoque.adicionarProduto(new Produto("Queijo", "Q001", 20, "2025-05-10"));
    estoque.adicionarProduto(new Produto("Iogurte", "I001", 40, "2025-03-20"));
    estoque.adicionarProduto(new Produto("Manteiga", "M001", 15, "2025-06-01"));
    
    // Listar produtos
    console.log("\n2. Listando produtos ordenados por data de vencimento (FIFO):");
    estoque.listarProdutos();
    
    // Verificar produtos próximos ao vencimento
    console.log("\n3. Verificando produtos próximos ao vencimento:");
    estoque.verificarProdutosProximosVencimento();
    
    // Vender produtos
    console.log("\n4. Vendendo produtos:");
    estoque.venderProduto("I001", 15); // Venda parcial
    estoque.venderProduto("P001", 30); // Venda total
    
    // Listar novamente após vendas
    console.log("\n5. Listando produtos após vendas:");
    estoque.listarProdutos();
    
    // Remover produtos vencidos
    console.log("\n6. Removendo produtos vencidos:");
    estoque.removerVencidos();
    
    // Gerar relatório de produtos vencidos
    console.log("\n7. Gerando relatório de produtos vencidos:");
    estoque.gerarRelatorioVencidos();
    
    // Adicionar produto já vencido para demonstração
    console.log("\n8. Adicionando um produto vencido para demonstração:");
    estoque.adicionarProduto(new Produto("Chocolate", "C001", 10, "2025-01-01"));
    
    // Gerar relatório de produtos vencidos novamente
    console.log("\n9. Gerando relatório de produtos vencidos após adição:");
    estoque.gerarRelatorioVencidos();
    
    // Remover produtos vencidos
    console.log("\n10. Removendo produtos vencidos:");
    estoque.removerVencidos();
    
    // Listar produtos finais
    console.log("\n11. Listando produtos finais:");
    estoque.listarProdutos();
  }
  
  // Executar a demonstração
  demonstracaoSistema();