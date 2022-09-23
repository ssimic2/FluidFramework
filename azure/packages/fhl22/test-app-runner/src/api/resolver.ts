const resolve = async(promise: Promise<any>) => {
    const resolved: any = {
      data: null,
      error: null
    };

    try {
        resolved.data = await promise;
    } catch(e) {
        resolved.error = e;
    }

    return resolved;
}

export default resolve
