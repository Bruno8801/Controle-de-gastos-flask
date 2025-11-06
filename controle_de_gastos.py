gastos = []

def adicionar_gasto():
    try:
        valor = float(input("Digite o valor do gasto: R$ ").replace(",", "."))
    except ValueError:
        print("❌ Valor inválido. Use números com vírgula ou ponto.")
        return
    categoria = input("Digite a categoria (ex: mercado, transporte): ")
    data = input("Digite a data (DD MM AAAA) use apenas numeros sem sinais e espaços: ")
    data_formatada = f"{data[:2]}/{data[2:4]}/{data[4:]}"

    gasto = {
        "valor": valor,
        "categoria": categoria,
        "data": data_formatada,
    }

    gastos.append(gasto)
    print("✅ Gasto adicionado com sucesso!\n")

def mostrar_gastos():
    print("\n📊 Tabela de Gastos:")
    print("{:<10} {:<15} {:<12}".format("Valor", "Categoria", "Data"))
    print("-" * 60)
    for g in gastos:
        print("{:<10.2f} {:<15} {:<12}".format(g["valor"], g["categoria"], g["data"]))
    print("-" * 60)
    print(f"Total de gastos: R$ {sum(g['valor'] for g in gastos):.2f}\n")

# Loop principal
while True:
    print("\n1 - Adicionar gasto")
    print("2 - Ver tabela de gastos")
    print("3 - Sair")
    opcao = input("Escolha uma opção: ")

    if opcao == "1":
        adicionar_gasto()
    elif opcao == "2":
        mostrar_gastos()
    elif opcao == "3":
        print("Encerrando o programa...")
        break
    else:
        print("Opção inválida. Tente novamente.")
