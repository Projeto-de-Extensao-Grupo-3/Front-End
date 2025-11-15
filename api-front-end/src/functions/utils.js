// Telefone format: (99)99999-9999
export const formatTelefone = (e, setErrorTelefone, setHelperTextTelefone) => {
    const chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var telefone = e.target.value;
    var tamanho = telefone.length;
    var formatado = "";
    var ultimo_num = telefone[tamanho - 1];
    if (!chars.includes(ultimo_num) || tamanho > 15 || (tamanho == 1 && ultimo_num == "(") || (tamanho == 4 && ultimo_num == " ") || (tamanho == 11 && ultimo_num == "-")) {
        e.target.value = telefone.substring(0, tamanho - 1);
    } else {
        for (var i = 0; i < tamanho - 1; i++) {
            formatado += telefone[i];
        }
        if (tamanho == 1) {
            e.target.value = formatado + "(" + ultimo_num;
        } else if (tamanho == 4) {
            e.target.value = formatado + ") " + ultimo_num;
        } else if (tamanho == 11) {
            e.target.value = formatado + "-" + ultimo_num;
        }
    }
    validarTelefone(tamanho, setErrorTelefone, setHelperTextTelefone);
}

const validarTelefone = (tamanho, setErrorTelefone, setHelperTextTelefone) => {
    if (tamanho < 15) {
        setErrorTelefone(true);
        setHelperTextTelefone("O telefone deve conter 11 dígitos.");
    } else {
        setErrorTelefone(false);
        setHelperTextTelefone("");
    }
}

export const aplicarMascaraTelefone = (telefone) => {
    let telefoneFormatado = "";
    for (let i = 0; i < telefone.length; i++) {
        if (i === 0) telefoneFormatado += "(";
        if (i === 2) telefoneFormatado += ") ";
        if (i === 7) telefoneFormatado += "-";
        telefoneFormatado += telefone[i];
    }
    return telefoneFormatado;
}

// CNPJ format: 00.000.000/0000-00
export const formatCnpj = (e, setErrorCnpj, setHelperTextCnpj) => {
    const chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var cnpj = e.target.value;
    var tamanho = cnpj.length;
    var formatado = "";
    var ultimo_num = cnpj[tamanho - 1];
    if (!chars.includes(ultimo_num) || tamanho > 18 || ((tamanho == 3 || tamanho == 7) && ultimo_num == ".") || (tamanho == 11 && ultimo_num == "/") || (tamanho == 16 && ultimo_num == "-")) {
        e.target.value = cnpj.substring(0, tamanho - 1);
    } else {
        for (var i = 0; i < tamanho - 1; i++) {
            formatado += cnpj[i];
        }
        if (tamanho == 3 || tamanho == 7) {
            e.target.value = formatado + "." + ultimo_num;
        } else if (tamanho == 11) {
            e.target.value = formatado + "/" + ultimo_num;
        } else if (tamanho == 16) {
            e.target.value = formatado + "-" + ultimo_num;
        }
    }
    validarCnpj(tamanho, setErrorCnpj, setHelperTextCnpj);
}

const validarCnpj = (tamanho, setErrorCnpj, setHelperTextCnpj) => {
    if (tamanho < 18) {
        setErrorCnpj(true);
        setHelperTextCnpj("O CNPJ deve conter 14 dígitos.");
    } else {
        setErrorCnpj(false);
        setHelperTextCnpj("");
    }
}

export const aplicarMascaraCnpj = (cnpj) => {
    let cnpjFormatado = "";
    for (let i = 0; i < cnpj.length; i++) {
        if (i === 2) cnpjFormatado += ".";
        if (i === 5) cnpjFormatado += ".";
        if (i === 8) cnpjFormatado += "/";
        if (i === 12) cnpjFormatado += "-";
        cnpjFormatado += cnpj[i];
    }
    return cnpjFormatado;
}

// CPF format: 000.000.000-00
export const formatCpf = (e, setErrorCpf, setHelperTextCpf) => {
    const chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var cpf = e.target.value;
    var tamanho = cpf.length;
    var formatado = "";
    var ultimo_num = cpf[tamanho - 1];
    if (!chars.includes(ultimo_num) || tamanho > 14 || ((tamanho == 4 || tamanho == 8) && ultimo_num == ".") || (tamanho == 12 && ultimo_num == "-")) {
        e.target.value = cpf.substring(0, tamanho - 1);
    } else {
        for (var i = 0; i < tamanho - 1; i++) {
            formatado += cpf[i];
        }
        if (tamanho == 4 || tamanho == 8) {
            e.target.value = formatado + "." + ultimo_num;
        } else if (tamanho == 12) {
            e.target.value = formatado + "-" + ultimo_num;
        }
    }
    validarCpf(tamanho, setErrorCpf, setHelperTextCpf);
}

const validarCpf = (tamanho, setErrorCpf, setHelperTextCpf) => {
    if (tamanho < 14) {
        setErrorCpf(true);
        setHelperTextCpf("O CPF deve conter 11 dígitos.");
    } else {
        setErrorCpf(false);
        setHelperTextCpf("");
    }
}

export const aplicarMascaraCpf = (cpf) => {
    let cpfFormatado = "";
    for (let i = 0; i < cpf.length; i++) {
        if (i === 3) cpfFormatado += ".";
        if (i === 6) cpfFormatado += ".";
        if (i === 9) cpfFormatado += "-";
        cpfFormatado += cpf[i];
    }
    return cpfFormatado;
}

// Validar e-mail
export const validarEmail = (e, setErrorEmail, setHelperTextEmail) => {
    const email = e.target.value;
    if (email.match(/^[A-Za-z0-9_+-]+\.?[A-Za-z0-9]+\@[a-z]+\.[a-z]{3,64}\.?[a-z]{0,3}$/)) {
        setErrorEmail(false);
        setHelperTextEmail("");
    } else {
        setErrorEmail(true);
        setHelperTextEmail("E-mail inválido.");
    }
}

