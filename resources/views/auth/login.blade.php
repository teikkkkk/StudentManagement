	<link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
	<script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<link rel="stylesheet" href="css/app.css">


	<!DOCTYPE html>
	<html>
		
	<head>
		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.1/css/all.css" integrity="sha384-gfdkjb5BdAXd+lj+gudLWI+BXq4IuLW5IT+brZEZsLFm++aCMlF1V92rMkPaX4PP" crossorigin="anonymous">
	</head>

	<body>
		<div class="container h-100">
			<div class="d-flex justify-content-center h-100">
				<div class="user_card">
					<div class="d-flex justify-content-center">
						<h1>Login</h1>
					</div>
					@if (session('error'))
					<div class="alert alert-danger mt-3">
						{{ session('error') }}
					</div>
					@endif
					@if (session('success'))
					<div class="alert alert-success mt-3">
						{{ session('success') }}
					</div>
					@endif
					<div class="d-flex justify-content-center form_container">
						<form action="{{ route('login') }}" method="POST">
							@csrf
							<div class="input-group mb-3">
								<div class="input-group-append">
									<span class="input-group-text"><i class="fas fa-phone"></i></span>
								</div>
								<input type="phone" name="phone" class="form-control input_user"  placeholder="phone">
							</div>
							<div class="input-group mb-2">
								<div class="input-group-append">
									<span class="input-group-text"><i class="fas fa-key"></i></span>
								</div>
								<input type="password" name="password" class="form-control input_pass" placeholder="password">
							</div>
							<div class="form-group">
								<div class="custom-control custom-checkbox">
									<input type="checkbox" class="custom-control-input" id="customControlInline">
									<label class="custom-control-label" for="customControlInline">Remember me</label>
								</div>
							</div>
								<div class="d-flex justify-content-center mt-3 login_container">
						<button type="submit"  class="btn login_btn" >Login</button>
					</div>
						</form>
					</div>
					
					<div class="mt-4">
						<div class="d-flex justify-content-center links">
							Don't have an account? <a href="{{route("registerform")}}" class="ml-2">Sign Up</a>
						</div>
						<a href="{{ route('login.google') }}"> dsds</a>
						<div class="d-flex justify-content-center links">
							<a href="{{ route("forgotPasswordForm") }}">Forgot your password?</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</body>
	</html>
